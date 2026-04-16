# finance-jars

Aplicacion local-first de finanzas personales para uso real local y presentacion de portfolio.

## Stack

- Monorepo con npm workspaces
- Frontend: React + Vite + TailwindCSS + Zustand
- Backend: NestJS + Prisma + SQLite
- Arquitectura backend: domain / application / infrastructure / presentation

## Estructura

```txt
apps/
  api/     # NestJS + Prisma + SQLite
  web/     # React + Vite
packages/
  shared/  # Tipos compartidos
```

## Requisitos

- Node.js 20+
- npm 10+

## Setup rapido

1. Instalar dependencias:

```bash
npm install
```

2. Configurar entorno API:

```bash
cp apps/api/.env.example apps/api/.env
```

3. Generar cliente Prisma y aplicar migraciones:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. (Opcional) Cargar seed demo:

```bash
npm run prisma:seed
```

## Desarrollo

En terminales separadas:

```bash
npm run dev:api
npm run dev:web
```

- API: http://localhost:3000
- Web: http://localhost:5173

Tambien se puede lanzar todo junto:

```bash
npm run dev
```

## Calidad

```bash
npm run lint
npm run test
npm run build
```

## Scripts utiles de Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

## Usuario demo seed

Si ejecutas el seed:

- Usuario: demo
- Password: demo12345

Puedes sobrescribirlos con variables `DEMO_USERNAME` y `DEMO_PASSWORD` en `apps/api/.env`.
