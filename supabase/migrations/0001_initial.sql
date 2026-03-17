-- ─── MindFlowAI — Initial Schema ────────────────────────────────────────────

-- ── Profiles ────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  role       text not null default 'artisan' check (role in ('artisan', 'client')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "users manage own profile" on profiles
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'artisan')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Services ────────────────────────────────────────────────────────────────
create table if not exists services (
  id              uuid primary key default gen_random_uuid(),
  artisan_id      uuid not null references auth.users(id) on delete cascade,
  label           text not null,
  description     text not null default '',
  duration        int  not null check (duration > 0),
  estimated_value int  not null default 0,
  position        int  not null default 0,
  active          boolean not null default true,
  created_at      timestamptz default now()
);

alter table services enable row level security;

-- Artisan manages their own services
create policy "artisan manages services" on services
  using (auth.uid() = artisan_id)
  with check (auth.uid() = artisan_id);

-- Anyone can read active services (public booking page)
create policy "public reads active services" on services
  for select using (active = true);

-- ── Appointments ────────────────────────────────────────────────────────────
create table if not exists appointments (
  id              uuid primary key default gen_random_uuid(),
  artisan_id      uuid not null references auth.users(id) on delete cascade,
  service_id      uuid references services(id) on delete set null,
  service_label   text not null,
  date            date not null,
  time            time not null,
  duration        int  not null,
  status          text not null default 'pending'
                  check (status in ('pending', 'confirmed', 'cancelled')),
  estimated_value int  not null default 0,
  client_name     text not null,
  client_phone    text not null,
  client_address  text not null,
  client_notes    text,
  client_email    text,
  created_at      timestamptz default now()
);

alter table appointments enable row level security;

-- Artisan can manage their appointments
create policy "artisan manages appointments" on appointments
  using (auth.uid() = artisan_id)
  with check (auth.uid() = artisan_id);

-- Public can insert (booking page — artisan_id must be valid)
create policy "public can book" on appointments
  for insert with check (true);

-- ── RDV Events ──────────────────────────────────────────────────────────────
create table if not exists rdv_events (
  id              uuid primary key default gen_random_uuid(),
  artisan_id      uuid not null references auth.users(id) on delete cascade,
  appointment_id  uuid references appointments(id) on delete set null,
  type            text not null,
  payload         jsonb not null default '{}',
  created_at      timestamptz default now()
);

alter table rdv_events enable row level security;

create policy "artisan reads own events" on rdv_events
  using (auth.uid() = artisan_id);

-- Enable realtime on rdv_events for live dashboard updates
alter publication supabase_realtime add table rdv_events;
alter publication supabase_realtime add table appointments;
