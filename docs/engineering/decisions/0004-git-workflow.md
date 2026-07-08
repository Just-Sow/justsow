# 0004: Git Workflow

## Status

Accepted

## Decision

JustSow will use:

- one branch per epic or parallel workstream
- small commits scoped to one task or coherent change
- merges back to the mainline only after the branch stays internally consistent

Epic branches should hold related work for a single larger stream, while individual commits should stay narrow enough to preserve readable history and safe rollback points.

## Why

- concurrent work is expected across epics and sub-tasks
- the repo is intended for multi-agent and human collaboration
- task-sized commits make review, debugging, and cherry-picking materially easier

## Constraints

- generated artifacts, local env files, and machine-specific files should stay out of git
- shared migrations, source, and durable docs should stay in git
- workflow guidance should remain simple enough to follow without extra tooling
