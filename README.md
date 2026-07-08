# JustSow

JustSow is evolving into a single product with:

- a public website
- donor accounts and payments
- project owner application and content management
- employee approval and publishing workflows

This repository contains the current JustSow codebase and planning material. The current code lives in:

- `apps/web/`
- `apps/api/`
- `docs/`

## Current Direction

The target structure is:

```text
apps/
  web/
  api/
packages/
  shared/
docs/
```

The monorepo foundation is in place with a single root git repo, root `pnpm` workspace management, and a thin Turborepo task layer.

`packages/shared/` now holds the first cross-app identity and auth contract definitions used by the API.

## Source of Truth

- `docs/product/current/` contains the latest agreed product direction.
- `docs/product/planned/` contains draft or future-looking planning material.
- Application code is the source of truth for implemented behavior.
- `docs/` is the canonical documentation directory.

## Root Workflow

The intended root developer workflow is:

- `pnpm install`
- copy `.env.example` to `.env`
- `pnpm db:up` to start local PostgreSQL
- `pnpm test:setup` for first-time browser test setup
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`
- `pnpm format`

Turborepo is used as a thin orchestration layer over the workspace.

## Git Workflow

The intended git workflow is:

- create one branch per epic or parallel workstream
- make small commits per task or coherent change
- keep local env files and machine-specific artifacts out of git
- commits on epic branches can be made without per-commit approval
- merges into `main` and direct commits to `main` require explicit approval

This keeps history readable while still allowing concurrent work across larger streams.

## Local Database

Development is expected to run against local PostgreSQL via `docker compose`, not a shared live dev database.

- `pnpm db:up`
- `pnpm db:down`
- `pnpm db:logs`
