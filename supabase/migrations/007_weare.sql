-- ──────────────────────────────────────────────────────────
-- Migration 007: WEARE Scoring Engine tables
-- weekly_check_ins + weare_scores
-- ──────────────────────────────────────────────────────────

-- ── Weekly Check-Ins ─────────────────────────────────────

create table if not exists public.weekly_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  couple_id uuid not null references public.couples(id) on delete cascade,
  week_of date not null,
  external_stress_level smallint not null check (external_stress_level between 1 and 10),
  support_system_rating smallint not null check (support_system_rating between 1 and 10),
  relationship_satisfaction smallint not null check (relationship_satisfaction between 1 and 10),
  practice_highlight text,
  created_at timestamptz not null default now(),

  -- One check-in per user per week
  unique (user_id, couple_id, week_of)
);

-- RLS: users manage their own check-ins
alter table public.weekly_check_ins enable row level security;

create policy "Users can insert own check-ins"
  on public.weekly_check_ins for insert
  with check (auth.uid() = user_id);

create policy "Users can read own check-ins"
  on public.weekly_check_ins for select
  using (auth.uid() = user_id);

create policy "Users can update own check-ins"
  on public.weekly_check_ins for update
  using (auth.uid() = user_id);

-- ── WEARE Scores ─────────────────────────────────────────

create table if not exists public.weare_scores (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  calculated_by uuid not null references auth.users(id) on delete cascade,
  data_mode text not null check (data_mode in ('full', 'single-partner', 'preliminary')),
  variables jsonb not null,
  layers jsonb not null,
  bottleneck jsonb not null,
  movement_phase text not null check (movement_phase in ('recognition', 'release', 'resonance', 'embodiment')),
  movement_narrative text not null,
  warm_summary text not null,
  calculated_at timestamptz not null default now()
);

-- RLS: users can read WEARE scores for their couple
alter table public.weare_scores enable row level security;

create policy "Users can insert WEARE scores for their couple"
  on public.weare_scores for insert
  with check (
    exists (
      select 1 from public.couples
      where id = couple_id
        and (partner_a_id = auth.uid() or partner_b_id = auth.uid())
    )
  );

create policy "Users can read WEARE scores for their couple"
  on public.weare_scores for select
  using (
    exists (
      select 1 from public.couples
      where id = couple_id
        and (partner_a_id = auth.uid() or partner_b_id = auth.uid())
    )
  );

-- ── Indexes ──────────────────────────────────────────────

create index if not exists idx_weekly_checkins_couple_week
  on public.weekly_check_ins (couple_id, week_of desc);

create index if not exists idx_weekly_checkins_user
  on public.weekly_check_ins (user_id, week_of desc);

create index if not exists idx_weare_scores_couple
  on public.weare_scores (couple_id, calculated_at desc);
