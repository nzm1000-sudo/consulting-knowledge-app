create extension if not exists vector;

create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  occurred_at timestamptz not null,
  transcript text not null,
  source text not null default 'plaud',
  summary text,
  created_at timestamptz not null default now()
);

create table people (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table cases (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings(id) on delete cascade,
  person_id uuid references people(id) on delete set null,
  problem text not null,
  advice text,
  reasoning text,
  decision text,
  outcome text,
  confidence numeric check (confidence between 0 and 1),
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create table principles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  confidence numeric check (confidence between 0 and 1),
  positive_outcomes integer not null default 0,
  appearances integer not null default 0,
  created_at timestamptz not null default now()
);

create table case_principles (
  case_id uuid references cases(id) on delete cascade,
  principle_id uuid references principles(id) on delete cascade,
  is_exception boolean not null default false,
  primary key (case_id, principle_id)
);

create table follow_ups (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade,
  person_id uuid references people(id) on delete set null,
  title text not null,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

