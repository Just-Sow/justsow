# Engineering Decisions

This folder stores architectural decisions that are current and intentional.

Use short ADR-style documents when a decision affects repo structure, deployment, package management, auth, payments, or domain boundaries.

Status rules:

- use `Proposed` for any new or amended decision that has not been explicitly approved by the user
- use `Accepted` only after the user has explicitly approved the decision
- if discussion leads to changes, update the note and leave it as `Proposed` until approval is confirmed

Git workflow authority rules:

- commits on epic or other non-`main` branches do not require per-commit approval
- merges into `main` require explicit user approval
- direct commits to `main` require explicit user approval
