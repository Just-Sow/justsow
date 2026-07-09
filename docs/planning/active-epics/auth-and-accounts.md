# Auth And Accounts

## Objective

Define and implement the account system for multi-role users, including secure account lifecycle flows and sower account claiming.

## Scope

- user identity model
- multi-role authorization model
- sign-up and sign-in
- email verification
- password reset
- account email updates
- two-factor authentication
- claiming manually created sower records

## Non-Goals

- payment provider integration
- advanced profile customization

## Dependencies

- shared role and permission definitions
- email delivery approach
- core user and sower data model

## Open Questions

- what 2FA method should be preferred for MVP
- how account claiming should be verified beyond email ownership
- whether some staff-created users should be invite-only

## Acceptance Criteria

- user-role model supports multiple roles per account
- sower claiming flow preserves existing history
- email-driven account lifecycle is fully defined
- security-sensitive flows are auditable

## Status

In Progress

## Progress

Completed:

- shared identity and auth contract definitions in `packages/shared`
- initial API auth capabilities route for cross-app contract consumption
- proposed decision note for additive multi-role accounts and claimable sower records
- accepted auth stack direction: Better Auth + PostgreSQL + Drizzle
- local development database workflow scaffolded with root `docker compose`
- Better Auth and Drizzle dependencies installed and API scaffold validated with build and tests
- persisted role assignment and audit event table shapes defined for the API schema
- role assignment and audit event service helpers added for later auth and admin flows
- sower profile and claim-linkage schema plus service helpers defined for manual record claiming
- app-facing auth API endpoints added for current identity, role management, and sower claim workflows
- TOTP-based 2FA backend support configured with Better Auth and matching schema migration generated
- local database prepare/setup scripts added for dev and test auth workflows
- shared contract updated to use the Creative Evangelist role name
- shared 2FA policy contract now defines recommended and required role sets
- app-facing auth responses now expose per-user 2FA requirement state for the UI
- privileged auth app routes now enforce required-role 2FA before allowing staff/admin actions
- web auth pages now cover sign-up, sign-in, forgot password, reset password, email verification, and 2FA challenge
- web dev server now proxies auth requests to the API so cookie-based auth can be exercised locally without cross-origin setup
- shared auth validation constraints now define 8-32 character passwords and require sign-up names to contain at least two words, with API enforcement on sign-up
- authenticated web UI state now loads from the current auth session API and guards account settings
- account settings now support self-service name, email, phone number, password, and two-factor management
- auth profile data now includes phone number, password-changed timestamp, and two-factor enabled timestamp for account settings
- password changes now record a timestamp and account settings show the latest password and two-factor security status metadata
- manual sower records can now be created through a development-only API route for local claim-flow testing
- normal sign-up now auto-claims an existing unlinked sower profile when the email matches

Next:

- refine and verify the account claiming flow in the web app around normal sign-up and verification
