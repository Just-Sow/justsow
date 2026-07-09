# 0003: Auth And Development Database

## Status

Accepted

## Decision

JustSow will use:

- Better Auth for application-managed authentication
- PostgreSQL as the primary relational database
- Drizzle ORM for schema and query management
- local Postgres via `docker compose` for day-to-day development

The API in `apps/api` is the auth source of truth. The web app will consume that auth surface rather than owning authentication logic independently.

Local development may use separate web and API origins for convenience, but the intended production shape is to serve both from the same public address.

## Why

- Better Auth provides a stronger middle ground than rolling auth flows internally while keeping control in the codebase.
- The product needs email/password, sessions, verification, reset flows, role-aware accounts, and room for later 2FA and sower claiming.
- PostgreSQL matches the product's relational workflow and early-production direction.
- Local Postgres avoids dependence on a shared live development database and keeps dev/test workflows reproducible.

## Constraints

- auth must remain centered in the API, not split across unrelated runtimes
- development should work with a locally run database
- local origin configuration should stay flexible without implying a permanently split production host model
- migrations must live in the repo
- final 2FA plugin choice and claim-verification details remain open
