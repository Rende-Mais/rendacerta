# Setup rapido no Supabase

## 1) Criar as tabelas e politicas

No SQL Editor do Supabase, execute o arquivo:

- `supabase/sql/001_mvp_catalog.sql`

## 2) Importar dados iniciais via CSV

No Table Editor, use `Import data from CSV` para cada tabela:

1. `institutions` com `supabase/csv_templates/institutions.csv`
2. `offers` com `supabase/csv_templates/offers.csv`
3. `offer_rate_history` com `supabase/csv_templates/offer_rate_history.csv`
4. `app_config` com `supabase/csv_templates/app_config.csv`

## 3) Configurar app Expo

No app mobile (`artifacts/rende-mais`), copie:

- `.env.example` para `.env`

E preencha:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 4) Validar fluxo

1. Abrir o app
2. Verificar se Home mostra os bancos vindos do Supabase
3. Alterar taxa de uma oferta no painel e testar refresh no app
4. Clicar em afiliado e confirmar inserts em `affiliate_clicks`
