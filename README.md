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

## Source of Truth

- `docs/product/current/` contains the latest agreed product direction.
- `docs/product/planned/` contains draft or future-looking planning material.
- Application code is the source of truth for implemented behavior.
- `docs/` is the canonical documentation directory.

## Root Workflow

The intended root developer workflow is:

- `pnpm install`
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

This keeps history readable while still allowing concurrent work across larger streams.
