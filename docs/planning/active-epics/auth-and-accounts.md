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

Next:

- generate the migration for sower profile and claim-linkage tables
- choose the MVP 2FA method
- design the actual sign-up, sign-in, verification, reset, and claiming flows
