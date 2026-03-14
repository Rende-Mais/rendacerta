# Project Context

This file provides essential context for any AI working within this project. 

## 1. Project Overview
- **Name**: RendeMais (Renda-Certa)
- **Description**: A mobile fintech app built with React Native + Expo that compares bank yields (CDI) in Brazil and calculates risks / FGC.
- **Localhost Directory**: `c:\Users\Patrick Luan\Downloads\Renda-Certa\Renda-Certa`

## 2. Tech Stack & Environment (update and add as needed)
- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Mobile app**: React Native + Expo SDK 54 (Expo Router for routing)
- **API framework**: Express 5
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## 3. Project Structure
The project is set up as a pnpm monorepo.
```text
Renda-Certa/
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

## 4. Key Components (Mobile App)
The mobile app (`artifacts/rende-mais`) uses Expo Router with a file-based routing architecture.
- **Onboarding Flow**: `app/(onboarding)/*`
- **Main Tabs**: `app/(tabs)/*` (Home, Comparar, Calcular, Perfil)
- **Design System Elements**: Inter font (weights 400-700), strict Light Mode exclusive styling. Focus on `brand-500` green (`#16A34A`) and FGC trust blue (`#1D4ED8`).

