# JustSow

JustSow is a monorepo for the JustSow web and API applications.

It currently contains:

- `apps/web/` for the SvelteKit web app
- `apps/api/` for the Fastify API
- `packages/shared/` for shared contracts and domain helpers
- `docs/` for product and engineering documentation
- `LICENSE` for the proprietary license terms

The root workspace uses `pnpm` with `turbo` as the task orchestrator.

## Development Commands

Run these from the repository root:

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`
- `pnpm format`
- `pnpm test:setup`
- `pnpm check`
- `pnpm db:up`
- `pnpm db:down`
- `pnpm db:logs`
- `pnpm db:prepare`
- `pnpm db:setup`
- `pnpm db:reset:dev`

Package-specific commands:

- `pnpm --filter @justsow/web dev`
- `pnpm --filter @justsow/web build`
- `pnpm --filter @justsow/web lint`
- `pnpm --filter @justsow/web test`
- `pnpm --filter @justsow/web typecheck`
- `pnpm --filter @justsow/web format`
- `pnpm --filter @justsow/web test:setup`
- `pnpm --filter @justsow/api dev`
- `pnpm --filter @justsow/api build`
- `pnpm --filter @justsow/api lint`
- `pnpm --filter @justsow/api test`
- `pnpm --filter @justsow/api typecheck`
- `pnpm --filter @justsow/api format`
