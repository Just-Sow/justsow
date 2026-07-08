# Project Workflow

## Objective

Define and implement the full moderated project lifecycle from draft through review, publication, sown state, completion, and archival.

## Scope

- project creation
- draft saving
- submission and review
- revision requests
- owner resubmission
- moderated edits after approval
- publish and unpublish control
- case study selection

## Non-Goals

- replacing the broader Notion operational workflow

## Dependencies

- auth and role model
- project and revision data model
- audit event strategy
- media handling approach

## Open Questions

- exact status model for approved but unpublished projects
- whether revisions should store snapshots or field-level changes
- whether case studies should be a status, flag, or separate projection

## Acceptance Criteria

- owners cannot directly modify live published content
- gatekeepers can review both new submissions and later edits
- workflow decisions are auditable
- project visibility rules are explicit

## Status

Planned
