# Implementacao backend Supabase (MVP)

## Status atual

Backend do MVP implementado no app com Supabase para:

1. Catalogo remoto de instituicoes/ofertas/taxas/config sem precisar atualizar o app do usuario.
2. Cache local para abrir rapido e fallback offline.
3. Tracking de clique em afiliado com snapshot do onboarding.
4. Operacao manual por CSV por tabela.

Sem uso de Supabase Storage (conforme solicitado).

## O que foi implementado

### App (Expo)

- Cliente Supabase e integracao remota em `artifacts/rende-mais/services/supabaseCatalog.ts`.
- Provider global de dados em `artifacts/rende-mais/providers/AppDataProvider.tsx`.
- Home, Comparar, Calcular, Perfil e detalhe do banco migrados para usar catalogo remoto.
- CDI global vindo de `app_config.current_cdi_rate`.
- Tracking de afiliado no fluxo do `AffiliateSheet`.
- Cache local em `AsyncStorage`:
  - `remote_catalog_cache_v1`
  - `install_id`

### Banco (Supabase)

Criados scripts e templates em:

- SQL: `supabase/sql/001_mvp_catalog.sql`
- CSV:
  - `supabase/csv_templates/institutions.csv`
  - `supabase/csv_templates/offers.csv`
  - `supabase/csv_templates/offer_rate_history.csv`
  - `supabase/csv_templates/app_config.csv`
- Guia rapido: `supabase/README.md`

Tabelas criadas:

- `institutions`
- `offers`
- `offer_rate_history`
- `app_config`
- `affiliate_clicks`

Com RLS habilitado e politicas para leitura publica do catalogo + insert de cliques.

## Ambiente

- Variaveis em `artifacts/rende-mais/.env`:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Exemplo em `artifacts/rende-mais/.env.example`.
- `.env` protegido no `.gitignore`.

## Validacao tecnica

- Typecheck executado com sucesso:
  - `pnpm --filter @workspace/rende-mais typecheck`

## Acoes que voce ainda precisa fazer (manual no Supabase)

1. Abrir o SQL Editor e executar `supabase/sql/001_mvp_catalog.sql`.
2. Importar CSV por tabela via Table Editor:
   - `institutions`
   - `offers`
   - `offer_rate_history`
   - `app_config`
3. Conferir se os IDs (`institutions.id` e `offers.institution_id`) batem entre os CSVs.
4. Rodar o app e validar:
   - Home carregando dados remotos
   - Pull-to-refresh refletindo alteracoes
   - Inserts em `affiliate_clicks` ao clicar no afiliado

## Proximos passos recomendados (opcional)

1. Mover insert de `affiliate_clicks` para Edge Function (anti-spam + validacao server-side).
2. Adicionar campo de segmentacao UTM/campanha no evento de clique.
3. Criar rotinas de revisao semanal dos CSVs e backup de tabelas.
