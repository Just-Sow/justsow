# 0001: Monorepo Direction

## Status

Accepted

## Decision

JustSow will migrate toward a single monorepo with:

- one root git repository
- one package manager
- one root command surface
- one root documentation model

The expected initial monorepo shape is:

```text
apps/
  web/
  api/
packages/
  shared/
docs/
```

The expected package manager is `pnpm`, with `turborepo` used as a thin orchestration layer.

## Outcome

This direction has now been implemented at the repo foundation level:

- one root git repository
- `apps/web` and `apps/api`
- root `pnpm` workspace management
- root Turborepo task orchestration
- initial `packages/shared` scaffold

## Why

The current structure splits the product across separate repositories and toolchains:

- `apps/web/`
- `apps/api/`
- `docs/`

That is inefficient for:

- shared developer workflow
- CI/CD
- shared types and contracts
- coordinated changes across frontend and backend
- Codex understanding of the whole product

## Constraints

- Keep Turborepo setup minimal.
- Avoid premature package sprawl.
- Keep documentation in `docs/` as the single active documentation area.
