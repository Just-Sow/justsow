# 0002: Identity And Role Model

## Status

Accepted

## Decision

JustSow will use a multi-role account model with additive permissions and claimable sower records.

The shared contract layer will define:

- a canonical role list for all apps
- account lifecycle stages for auth-sensitive flows
- supported account flows such as sign-up, sign-in, verification, reset, email change, 2FA, and sower claiming

## Why

Product requirements already assume:

- one person may hold multiple roles at the same time
- manually created sower records may later become real user accounts
- security-sensitive auth flows need explicit auditability

Locking this in early avoids divergent role enums and ad hoc auth assumptions between web and API.

## Constraints

- permissions stay role-based rather than account-type based
- sower claiming must preserve historical records
- final 2FA implementation details remain open, but the contract must reserve space for them
