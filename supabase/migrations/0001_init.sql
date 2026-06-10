create extension if not exists "pgcrypto";

do $$
begin
  create type public.debt_type as enum ('owed_to_me', 'i_owe');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type public.debt_type not null,
  counterpart_name text not null,
  amount bigint not null check (amount > 0),
  note text,
  due_date date,
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists debts_user_id_idx
  on public.debts (user_id);

create index if not exists debts_user_id_type_idx
  on public.debts (user_id, type);

create index if not exists debts_user_id_due_date_idx
  on public.debts (user_id, due_date)
  where due_date is not null;

create index if not exists debts_user_id_settled_at_idx
  on public.debts (user_id, settled_at);

create index if not exists debts_user_id_created_at_idx
  on public.debts (user_id, created_at desc);

drop trigger if exists debts_set_updated_at on public.debts;
create trigger debts_set_updated_at
before update on public.debts
for each row execute function public.set_updated_at();

alter table public.debts enable row level security;

drop policy if exists "debts_select_own" on public.debts;
create policy "debts_select_own"
on public.debts
for select
using (auth.uid() = user_id);

drop policy if exists "debts_insert_own" on public.debts;
create policy "debts_insert_own"
on public.debts
for insert
with check (auth.uid() = user_id);

drop policy if exists "debts_update_own" on public.debts;
create policy "debts_update_own"
on public.debts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "debts_delete_own" on public.debts;
create policy "debts_delete_own"
on public.debts
for delete
using (auth.uid() = user_id);
