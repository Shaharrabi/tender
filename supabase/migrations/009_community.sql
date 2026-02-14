-- ──────────────────────────────────────────────────────────
-- Migration 009: Community tables
-- Anonymous story sharing + resonated reactions
-- ──────────────────────────────────────────────────────────

-- ── Community Posts ────────────────────────────────────────

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 10 and 1000),
  category varchar(50) not null,
  healing_phase varchar(30),
  attachment_style varchar(30),
  is_approved boolean not null default true,
  is_flagged boolean not null default false,
  resonated_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- RLS: community posts
alter table public.community_posts enable row level security;

create policy "Anyone can read approved non-flagged posts"
  on public.community_posts for select
  using (is_approved = true and is_flagged = false);

create policy "Authenticated users can create posts"
  on public.community_posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update own posts"
  on public.community_posts for update
  using (auth.uid() = author_id);

-- Index for feed queries
create index if not exists idx_community_posts_feed
  on public.community_posts (created_at desc)
  where is_approved = true and is_flagged = false;

create index if not exists idx_community_posts_category
  on public.community_posts (category, created_at desc)
  where is_approved = true and is_flagged = false;

-- ── Community Reactions ───────────────────────────────────

create table if not exists public.community_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction_type varchar(20) not null default 'resonated',
  created_at timestamptz not null default now(),
  unique (post_id, user_id, reaction_type)
);

-- RLS: community reactions
alter table public.community_reactions enable row level security;

create policy "Anyone can read reactions"
  on public.community_reactions for select
  using (true);

create policy "Authenticated users can add reactions"
  on public.community_reactions for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own reactions"
  on public.community_reactions for delete
  using (auth.uid() = user_id);

-- Index for counting reactions per post
create index if not exists idx_community_reactions_post
  on public.community_reactions (post_id);

-- ── Trigger: auto-update resonated_count ──────────────────

create or replace function public.update_resonated_count()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update public.community_posts
      set resonated_count = resonated_count + 1
      where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.community_posts
      set resonated_count = greatest(resonated_count - 1, 0)
      where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger trg_update_resonated_count
  after insert or delete on public.community_reactions
  for each row
  execute function public.update_resonated_count();
