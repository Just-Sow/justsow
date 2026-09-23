# Sowers And Seeds

## Objective

Define and implement the MVP donor-side model where sowers can hold accounts, view seed history, and be linked to manually created records.

## Scope

- sower records
- manual sower creation by staff
- sower account history view
- multiple seed contributions per project using predefined amount options
- seed allocation records
- funding commitment, manual-transfer, and confirmed contribution states

## Non-Goals

- on-site payment processing
- online payment processing

## Dependencies

- auth and accounts
- project workflow model
- audit event strategy

## Open Questions

- what minimum seed metadata is needed for MVP
- whether seed allocation can be reversed and how that should be audited
- how staff search and deduplicate manual sower records

## Acceptance Criteria

- multiple contributions can be associated with the correct project and sower
- sowers with accounts can view their own history
- manual records can be claimed without losing continuity
- staff workflows remain simple for MVP

## Status

Planned
