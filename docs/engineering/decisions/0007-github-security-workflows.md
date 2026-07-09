# GitHub Security Workflows

## Status

Proposed

## Decision

Use Dependabot and CodeQL as the default GitHub security automation for this repo.

## Why

Dependabot covers dependency update drift and vulnerability alerts, while CodeQL adds static analysis for the JavaScript and TypeScript codebase without requiring production infrastructure.

## Constraints / Tradeoffs

- Keep the initial setup lightweight until production deploys exist.
- Avoid a separate `pnpm audit` gate for now because it overlaps heavily with Dependabot and tends to add noise before release hardening.
- Revisit secret scanning and container scanning when those surfaces become relevant.
