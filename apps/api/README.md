# finance-jars API

Backend NestJS para autenticacion local, frascos, ingresos, gastos y dashboard mensual.

## Entorno

Copiar variables ejemplo:

```bash
cp .env.example .env
```

Variables principales:

- `DATABASE_URL` (SQLite)
- `PORT`
- `CORS_ORIGIN`
- `DEMO_USERNAME` y `DEMO_PASSWORD` (solo para seed)

## Comandos

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Calidad

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## Arquitectura

```txt
src/
  domain/
  application/
  infrastructure/
  presentation/
```

## Notas de seguridad local

- Sesion en cookie httpOnly
- Token de sesion hasheado (sha256) en base
- Password con scrypt + salt
- CORS restringido por `CORS_ORIGIN`
