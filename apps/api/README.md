# JustSow API

This is the Fastify API for JustSow.

Current direction:

- Better Auth will be mounted from this app as the auth source of truth.
- Drizzle will manage database schema and queries.
- PostgreSQL is the development and production relational database.
- app-facing auth routes will sit alongside Better Auth endpoints for role-aware identity and staff workflows

Use root workspace commands where possible:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`

Automated test coverage:

- `pnpm test` runs the API suite against `DATABASE_TEST_URL`
- auth lifecycle coverage includes sign-up, verification, password reset, session-backed identity, and required-role 2FA enforcement

Database workflow:

- `pnpm db:up` from the repo root to start local Postgres
- `pnpm db:prepare` from the repo root to ensure dev and test databases exist
- `pnpm db:setup` from the repo root to prepare databases and apply migrations
- `pnpm --filter @justsow/api db:generate` to generate Drizzle migrations
- `pnpm --filter @justsow/api db:migrate` to apply migrations
- `pnpm --filter @justsow/api db:migrate:test` to apply migrations to the test database

Current auth API surface:

- Better Auth endpoints under `/api/auth/*`
- Better Auth 2FA endpoints under `/api/auth/two-factor/*`
- `GET /auth/capabilities`
- `GET /auth/setup`
- `GET /auth/dev/emails`
- `DELETE /auth/dev/emails`
- `GET /auth/dev/sower-profiles`
- `POST /auth/dev/sower-profiles`
- `GET /auth/me`
- `GET /auth/security`
- `GET /auth/roles`
- `GET /auth/sower-profile`
- `POST /auth/sower-claims`
- `POST /auth/admin/sower-profiles`
- `GET /auth/admin/sower-profiles/:profileId/claims`
- `POST /auth/admin/sower-claims/:claimId/approve`
- `POST /auth/admin/sower-claims/:claimId/reject`
- `GET /auth/admin/users/:userId/roles`
- `POST /auth/admin/users/:userId/roles`
- `DELETE /auth/admin/users/:userId/roles/:role`

Current 2FA direction:

- Better Auth TOTP plugin
- authenticator app flow for MVP
- backup codes enabled
- trusted devices enabled
- required for `gatekeeper`, `seed_allocator`, `stewardship_staff`, and `admin`
- recommended for `creative_evangelist` and `sower`
- privileged app routes reject role-required users until 2FA is enabled
- email/SMS OTP not used as the primary second factor for MVP

Current email lifecycle direction:

- Better Auth sign-up, verification, reset, and email change flows are mounted under `/api/auth/*`
- development uses a file-backed outbox at `apps/api/.data/dev-email-outbox.json`
- use `GET /auth/dev/emails` to inspect the latest verification and reset links during local UI work
- use `DELETE /auth/dev/emails` to clear the local outbox between test runs
- use `POST /auth/dev/sower-profiles` to create a manual unclaimed sower record for local claim-flow testing
