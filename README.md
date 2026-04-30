# CRM Backend (Monorepo)

This repository is organized as a small microservices monorepo. Services live under `services/`.

Quick start (recommended: pnpm)

```bash
# install pnpm via corepack (Node 16.10+), then bootstrap the workspace
corepack enable
pnpm -v
pnpm -w install
pnpm run dev
```

If you prefer npm:

```bash
# from repo root
npm install
npm run dev
```

Run a single service:

```bash
cd services/auth-service
pnpm install
pnpm run dev
```
