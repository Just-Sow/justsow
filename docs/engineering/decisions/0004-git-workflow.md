# 0004: Git Workflow

## Status

Accepted

## Decision

JustSow will use:

- one branch per epic or parallel workstream
- small commits scoped to one task or coherent change
- merges back to the mainline only after the branch stays internally consistent
- commits on epic or other non-`main` branches may be made without per-commit user approval
- merges into `main` and direct commits to `main` require explicit user approval
- work may continue across multiple tasks and commits in one turn when the user intent is clear
- the agent should only stop for user input when a meaningful decision needs approval or when user intent is unclear
- any amendment to an accepted decision must be re-approved by the user before it returns to `Accepted`

Epic branches should hold related work for a single larger stream, while individual commits should stay narrow enough to preserve readable history and safe rollback points.

## Commit Message Structure

Use a short, conventional subject line:

`type(scope): imperative summary`

Examples:

- `fix(auth): add route rate limiting`
- `docs(git): add commit message guidance`
- `feat(web): tighten otp layout`

Keep the subject under about 72 characters when practical. Add a brief body only when the change needs context that the subject cannot carry on its own.

## Why

- concurrent work is expected across epics and sub-tasks
- the repo is intended for multi-agent and human collaboration
- task-sized commits make review, debugging, and cherry-picking materially easier

## Constraints

- generated artifacts, local env files, and machine-specific files should stay out of git
- shared migrations, source, and durable docs should stay in git
- workflow guidance should remain simple enough to follow without extra tooling
