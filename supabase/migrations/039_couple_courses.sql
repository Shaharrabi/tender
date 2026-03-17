-- ═══════════════════════════════════════════════════════════
-- Couple Courses — Live two-player course sessions
-- ═══════════════════════════════════════════════════════════

-- Course sessions: tracks a couple playing through a course together
create table if not exists public.course_sessions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  course_id text not null,          -- e.g. 'family-echo', 'aliveness-map'
  started_by uuid not null references auth.users(id),
  status text not null default 'lobby' check (status in ('lobby', 'active', 'complete', 'abandoned')),
  current_round integer not null default 0,
  partner_a_id uuid references auth.users(id),
  partner_b_id uuid references auth.users(id),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  scores jsonb default '{"connection": 0, "insight": 0, "bids": 0}'::jsonb,
  created_at timestamptz not null default now()
);

-- Individual round responses
create table if not exists public.course_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.course_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  round_index integer not null,
  response_type text not null check (response_type in ('choice', 'slider')),
  choice_index integer,             -- which choice was selected (0-3)
  slider_value integer,             -- slider value (1-10)
  created_at timestamptz not null default now(),
  unique(session_id, user_id, round_index)
);

-- Badges earned from completing courses
create table if not exists public.course_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  couple_id uuid not null references public.couples(id) on delete cascade,
  course_id text not null,
  badge_name text not null,
  session_id uuid references public.course_sessions(id),
  earned_at timestamptz not null default now(),
  unique(user_id, couple_id, course_id)
);

-- Enable RLS
alter table public.course_sessions enable row level security;
alter table public.course_responses enable row level security;
alter table public.course_badges enable row level security;

-- RLS policies: users can only access their couple's sessions
create policy "Users can view own couple sessions" on public.course_sessions
  for select using (
    couple_id in (
      select id from public.couples where partner_a_id = auth.uid() or partner_b_id = auth.uid()
    )
  );

create policy "Users can insert sessions for own couple" on public.course_sessions
  for insert with check (
    couple_id in (
      select id from public.couples where partner_a_id = auth.uid() or partner_b_id = auth.uid()
    )
    and started_by = auth.uid()
  );

create policy "Users can update own couple sessions" on public.course_sessions
  for update using (
    couple_id in (
      select id from public.couples where partner_a_id = auth.uid() or partner_b_id = auth.uid()
    )
  );

-- Responses
create policy "Users can view own couple responses" on public.course_responses
  for select using (
    session_id in (
      select cs.id from public.course_sessions cs
      join public.couples c on cs.couple_id = c.id
      where c.partner_a_id = auth.uid() or c.partner_b_id = auth.uid()
    )
  );

create policy "Users can insert own responses" on public.course_responses
  for insert with check (user_id = auth.uid());

-- Badges
create policy "Users can view own badges" on public.course_badges
  for select using (user_id = auth.uid());

create policy "Users can earn badges" on public.course_badges
  for insert with check (user_id = auth.uid());

-- Indexes
create index if not exists idx_course_sessions_couple on public.course_sessions(couple_id, course_id);
create index if not exists idx_course_responses_session on public.course_responses(session_id);
create index if not exists idx_course_badges_user on public.course_badges(user_id, couple_id);

-- Enable realtime for course_sessions so partners can sync
alter publication supabase_realtime add table public.course_sessions;
