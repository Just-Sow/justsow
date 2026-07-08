# Repo Guidance

## Project State

This repository is a monorepo.

Current directories:

- `apps/web/` is the SvelteKit app.
- `apps/api/` is the Fastify app.
- `docs/` is the canonical documentation directory.

## Source-of-Truth Rules

- Code is the source of truth for implemented behavior.
- `docs/product/current/` is the source of truth for the latest agreed product direction.
- `docs/product/planned/` contains draft or future-looking planning material.

Do not assume that planning docs reflect the current implementation unless the code matches them.

## Expected Target Structure

```text
apps/
  web/
  api/
packages/
  shared/
docs/
```

## Workflow Intent

- Prefer root-level commands as the monorepo structure is introduced.
- Standardize on one package manager for the final repo.
- Keep Turborepo usage minimal: root orchestration, not a complex package graph.

## Decision Logging

Use `docs/engineering/decisions/` for decisions that are expected to matter over time, especially when they affect:

- repo structure
- package management
- deployment or infrastructure direction
- authentication or authorization model
- data model shape
- workflow rules that constrain implementation
- third-party platform commitments

Do not create a decision note for routine implementation details, obvious bug fixes, naming tweaks, or short-lived experiments.

Keep decision notes short. Record:

- the decision
- why it was made
- the main constraints or tradeoffs

Avoid long narrative history, meeting-style notes, or repetitive status logging. The point is to preserve durable context, not to document every step of execution.

## Planning Persistence

Use `docs/planning/` for high-level direction that should persist across sessions or across multiple agents.

Good candidates for persistent planning:

- roadmap phases
- prioritized backlog items
- active epic scope
- cross-session dependencies
- durable open questions that affect future work

Do not store session-specific implementation plans in files. Those should stay in the agent's internal plan for the current session.

Planning files should be brief and stable. Update them when project direction changes or when a multi-session workstream needs clearer shared context, not for ordinary execution progress.

## Documentation Maintenance

When a meaningful repo, architecture, workflow, or product-planning milestone is completed, update the relevant docs before considering the work finished.

Typically this means checking whether updates are needed in:

- `README.md`
- `docs/engineering/decisions/`
- `docs/engineering/architecture/`
- `docs/planning/roadmap.md`
- `docs/planning/backlog.md`
- the relevant file in `docs/planning/active-epics/`

Do not create busywork documentation updates for trivial code changes. The standard is: if future sessions or other agents would benefit from the state change being recorded, update the docs in the same turn.

## Product Shape

The product is expected to support:

- public project discovery and marketing pages
- donor authentication and payments
- project owner self-service editing and management
- employee approval, publishing, and oversight workflows

Operational workflows outside the site may continue to live in Notion. The site should focus on product-critical workflow steps rather than becoming a full internal ops platform.
