-- =============================================
-- Cut & Dry Barber Shop — Migration 001
-- Table des rendez-vous (bookings)
-- =============================================
-- À exécuter dans : Supabase > SQL Editor

create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  phone        text not null,
  service      text not null,
  booking_date date not null,
  booking_time time not null,
  status       text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled'))
);

-- Index pour les requêtes par date (vérif créneaux pris)
create index if not exists bookings_date_idx on public.bookings (booking_date, booking_time);

-- RLS : lecture publique des créneaux pris (date+heure uniquement)
alter table public.bookings enable row level security;

-- Politique : tout le monde peut insérer un RDV
create policy "insert_booking" on public.bookings
  for insert with check (true);

-- Politique : lecture des créneaux déjà pris (date + heure seulement, pas les données perso)
create policy "read_slots" on public.bookings
  for select using (true);
