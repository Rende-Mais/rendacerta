create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists institutions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text not null,
  brand_color text,
  logo_url text,
  affiliate_base_url text,
  fgc_covered boolean not null default true,
  risk_score integer,
  risk_level text check (risk_level in ('baixo', 'medio', 'alto')),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  slug text unique not null,
  title text not null,
  investment_type text not null check (investment_type in ('CDB', 'LCI', 'LCA', 'RDB')),
  cdi_rate numeric(6,2) not null check (cdi_rate >= 0),
  liquidity text not null check (liquidity in ('D+0', 'D+1', 'D+30', 'no_vencimento')),
  minimum_amount numeric(14,2) not null default 0,
  has_tax boolean not null default true,
  recommendation_score integer not null default 0,
  is_featured boolean not null default false,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  details_json jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists offer_rate_history (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references offers(id) on delete cascade,
  reference_date date not null,
  cdi_rate numeric(6,2) not null check (cdi_rate >= 0),
  created_at timestamptz not null default now(),
  unique (offer_id, reference_date)
);

create table if not exists app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  install_id text not null,
  institution_id uuid references institutions(id) on delete set null,
  offer_id uuid references offers(id) on delete set null,
  source_screen text not null,
  source_component text,
  available_amount_range text,
  liquidity_pref text,
  risk_pref text,
  app_version text,
  created_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;
grant select on institutions, offers, offer_rate_history, app_config to anon, authenticated;
grant insert on affiliate_clicks to anon, authenticated;

create index if not exists idx_institutions_active on institutions (is_active);
create index if not exists idx_offers_active on offers (is_active);
create index if not exists idx_offers_institution on offers (institution_id);
create index if not exists idx_offer_rate_history_offer on offer_rate_history (offer_id, reference_date);
create index if not exists idx_affiliate_clicks_created_at on affiliate_clicks (created_at desc);
create index if not exists idx_affiliate_clicks_offer on affiliate_clicks (offer_id);

drop trigger if exists institutions_set_updated_at on institutions;
create trigger institutions_set_updated_at
before update on institutions
for each row execute procedure set_updated_at();

drop trigger if exists offers_set_updated_at on offers;
create trigger offers_set_updated_at
before update on offers
for each row execute procedure set_updated_at();

drop trigger if exists app_config_set_updated_at on app_config;
create trigger app_config_set_updated_at
before update on app_config
for each row execute procedure set_updated_at();

alter table institutions enable row level security;
alter table offers enable row level security;
alter table offer_rate_history enable row level security;
alter table app_config enable row level security;
alter table affiliate_clicks enable row level security;

drop policy if exists institutions_select_public on institutions;
create policy institutions_select_public
on institutions for select
to anon, authenticated
using (is_active = true);

drop policy if exists offers_select_public on offers;
create policy offers_select_public
on offers for select
to anon, authenticated
using (is_active = true);

drop policy if exists offer_rate_history_select_public on offer_rate_history;
create policy offer_rate_history_select_public
on offer_rate_history for select
to anon, authenticated
using (true);

drop policy if exists app_config_select_public on app_config;
create policy app_config_select_public
on app_config for select
to anon, authenticated
using (key in ('current_cdi_rate', 'content_version', 'home_hero', 'featured_offer_slug', 'min_supported_version'));

drop policy if exists affiliate_clicks_insert_public on affiliate_clicks;
create policy affiliate_clicks_insert_public
on affiliate_clicks for insert
to anon, authenticated
with check (true);

insert into app_config (key, value)
values
  ('current_cdi_rate', '10.75'::jsonb),
  ('content_version', '"v1"'::jsonb)
on conflict (key) do nothing;
