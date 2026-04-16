# finance-jars

Scaffold inicial de una app de finanzas personales **local-first** para uso personal, con base presentable para portfolio.

## Stack

- Monorepo con npm workspaces
- Frontend: React + Vite + TailwindCSS + Zustand
- Backend: NestJS + Prisma + SQLite
- Arquitectura backend: clean architecture (domain/application/infrastructure/presentation)
- UI en español y dark mode

## Estructura

```txt
apps/
  web/     # Frontend desktop-first
  api/     # Backend NestJS + Prisma
packages/
  shared/  # Tipos compartidos
```

## Estado del scaffold

Incluye base mínima para:

- Auth local (username/password) con múltiples usuarios (estructura lista)
- Frascos y movimientos (estructura y endpoints base)
- Distribución automática de ingresos por reglas (modelo Prisma base)
- Dashboard mensual (ruta base frontend + endpoint backend base)
- Multi-moneda (campos/modelos y estado frontend base)

> No implementa aún toda la lógica de negocio; está preparado para iterar paso a paso con prompts más específicos.

## Scripts (raíz)

```bash
npm install
npm run dev        # corre apps con script dev en workspaces
npm run dev:web    # frontend
npm run dev:api    # backend
npm run build
npm run test
npm run lint
```

## Backend Prisma

```bash
npm run prisma:generate -w @finance-jars/api
npm run prisma:migrate -w @finance-jars/api
npm run prisma:studio -w @finance-jars/api
```

Archivo de entorno ejemplo:

- `apps/api/.env.example`
