# JustSow API

This is the Fastify API for JustSow.

Current direction:

- Better Auth will be mounted from this app as the auth source of truth.
- Drizzle will manage database schema and queries.
- PostgreSQL is the development and production relational database.

Use root workspace commands where possible:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`

Database workflow:

- `pnpm db:up` from the repo root to start local Postgres
- `pnpm --filter @justsow/api db:generate` to generate Drizzle migrations
- `pnpm --filter @justsow/api db:migrate` to apply migrations
