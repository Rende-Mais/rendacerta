# Workspace — RendeMais

## Overview

App mobile fintech React Native + Expo que compara rendimentos (CDI) de bancos brasileiros.
Monorepo pnpm com TypeScript. Cada package gerencia suas próprias dependências.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Mobile**: React Native + Expo SDK 54
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### `artifacts/rende-mais` — App Mobile RendeMais

App Expo com Expo Router (file-based routing). Compara rendimentos de bancos, calcula riscos, FGC e possui calculadora de investimentos.

**Telas:**
- `app/(onboarding)/boas-vindas.tsx` — Slide 0: proposta de valor
- `app/(onboarding)/quanto-investir.tsx` — Slide 1: valor disponível
- `app/(onboarding)/por-quanto-tempo.tsx` — Slide 2: liquidez preferida
- `app/(onboarding)/prioridade.tsx` — Slide 3: taxa vs segurança
- `app/(tabs)/index.tsx` — Home: Ranking CDI com filtros
- `app/(tabs)/comparar.tsx` — Comparação lado a lado de bancos
- `app/(tabs)/calcular.tsx` — Calculadora de rendimento com projeções
- `app/(tabs)/perfil.tsx` — Perfil de investidor e configurações
- `app/banco/[id].tsx` — Detalhe completo do banco

**Componentes:**
- `components/OfferCard.tsx` — Card principal de oferta de banco
- `components/BankLogo.tsx` — Logo do banco (círculo colorido)
- `components/LiquidityPill.tsx` — Badge de liquidez traduzido para PT-BR
- `components/RiskMeter.tsx` — Medidor de risco do banco
- `components/AffiliateSheet.tsx` — Bottom sheet de redirecionamento para afiliado
- `components/ui/Badge.tsx` — Badge reutilizável (brand, fgc, neutral, warning, error)
- `components/ui/Button.tsx` — Botão reutilizável com haptic feedback
- `components/ui/SkeletonCard.tsx` — Skeleton de loading animado

**Constants:**
- `constants/colors.ts` — Design system: cores brand verde, neutros, FGC azul
- `constants/data.ts` — Dados dos bancos, funções de cálculo CDI/rendimento
- `constants/storage.ts` — Keys AsyncStorage e tipos de perfil do usuário

**Design System:**
- Fonte: Inter (400/500/600/700)
- Cores primárias: brand-500 #16A34A (verde)
- FGC: #1D4ED8 (azul confiança)
- Background: #FAFAFA
- Modo: Light mode exclusivo

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── rende-mais/         # App mobile Expo RendeMais
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```
