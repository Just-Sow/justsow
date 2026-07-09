# Monorepo Foundation

## Objective

Move the codebase toward a clean root monorepo structure with a simple developer workflow and enough shared tooling for sustained multi-agent work.

## Scope

- root workspace configuration
- root command surface
- app relocation into target structure
- shared package foundation
- root CI task shape

## Non-Goals

- a complex package graph
- heavy Turborepo customization
- premature package extraction

## Dependencies

- accepted repo structure
- package manager standardization
- agreement on root workflow commands

## Open Questions

- whether any code should remain in standalone repos during the transition
- how aggressively generated files should be relocated or ignored
- what minimum CI tasks should exist on day one

## Acceptance Criteria

- the repo has one clear root workflow
- web and api can be developed from the root
- shared packages can be introduced without restructuring again
- documentation and workflow are clear enough for future agents to resume work quickly

## Status

Complete

## Progress

Completed:

- root workspace configuration
- root command surface
- app relocation into `apps/web` and `apps/api`
- initial shared package scaffold
- single root git repository
- minimal Turborepo orchestration

Follow-up work moved outside this epic:

- initial CI task setup
- shared package expansion beyond the scaffold
