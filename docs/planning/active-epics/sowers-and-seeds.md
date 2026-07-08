# Sowers And Seeds

## Objective

Define and implement the MVP donor-side model where sowers can hold accounts, view seed history, and be linked to manually created records.

## Scope

- sower records
- manual sower creation by staff
- sower account history view
- one seed per project rule
- seed allocation records
- project sown state

## Non-Goals

- on-site payment processing
- multi-seed project funding for MVP

## Dependencies

- auth and accounts
- project workflow model
- audit event strategy

## Open Questions

- what minimum seed metadata is needed for MVP
- whether seed allocation can be reversed and how that should be audited
- how staff search and deduplicate manual sower records

## Acceptance Criteria

- a project can be clearly identified as unsown or sown
- sowers with accounts can view their own history
- manual records can be claimed without losing continuity
- staff workflows remain simple for MVP

## Status

Planned
