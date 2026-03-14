create table if not exists ad_events (
  id uuid primary key default gen_random_uuid(),
  install_id text not null,
  placement text not null check (placement in ('home_banner_bottom', 'home_native_feed')),
  screen text not null,
  source_component text,
  ad_network text not null check (ad_network in ('admob')),
  ad_format text not null check (ad_format in ('banner', 'native')),
  event_type text not null check (event_type in ('impression', 'click', 'paid')),
  value_micros bigint,
  currency_code text,
  app_version text,
  created_at timestamptz not null default now()
);

grant insert on ad_events to anon, authenticated;

create index if not exists idx_ad_events_created_at on ad_events (created_at desc);
create index if not exists idx_ad_events_placement on ad_events (placement, created_at desc);

alter table ad_events enable row level security;

drop policy if exists ad_events_insert_public on ad_events;
create policy ad_events_insert_public
on ad_events for insert
to anon, authenticated
with check (true);

drop policy if exists app_config_select_public on app_config;
create policy app_config_select_public
on app_config for select
to anon, authenticated
using (
  key in (
    'current_cdi_rate',
    'content_version',
    'home_hero',
    'featured_offer_slug',
    'min_supported_version',
    'ads_enabled',
    'home_banner_enabled',
    'home_native_enabled',
    'home_native_frequency'
  )
);

insert into app_config (key, value)
values
  ('ads_enabled', 'true'::jsonb),
  ('home_banner_enabled', 'true'::jsonb),
  ('home_native_enabled', 'true'::jsonb),
  ('home_native_frequency', '8'::jsonb)
on conflict (key) do nothing;
