# Repo Guidance

## Project State

This repository is a monorepo.

Current directories:

- `apps/web/` is the SvelteKit app.
- `apps/api/` is the Fastify app.
- `docs/` is the canonical documentation directory.

The product currently centers on donors, Creative Evangelists, and employees, with the website covering authentication, project workflows, approval/publishing, auditability, and eventual payments.

## Source-of-Truth Rules

- Code is the source of truth for implemented behavior.
- `docs/product/current/` is the source of truth for the latest agreed product direction.
- `docs/product/planned/` contains draft or future-looking planning material.

Do not assume that planning docs reflect the current implementation unless the code matches them.

## Documentation Navigation

Treat each `README.md` under `docs/` as an index page for that directory. Start with `docs/README.md`, then read the relevant subtree README, then inspect the specific decision, planning, product, architecture, or runbook docs that match the task.

For implementation work, inspect `docs/engineering/decisions/` first when a change could affect repo structure, workflow, auth, data model, deployment, or other durable behavior. For product direction, inspect `docs/product/current/` and then any relevant supporting doc under that folder. For active workstreams, inspect `docs/planning/active-epics/`.

Treat these docs as dynamic guidance: use the directory indexes to locate the current context, then confirm the code still matches before changing behavior.

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

Decision statuses must follow this rule:

- new or amended decision notes should default to `Proposed`
- only the user may authorize changing a decision status to `Accepted`
- any amendment to a previously accepted decision must be re-approved by the user before it returns to `Accepted`
- if a decision needs revision after discussion, update the note and keep it `Proposed` until the user explicitly approves it

Git approval rules must follow this rule:

- commits on an epic or other non-`main` branch do not require per-commit user approval
- merges into `main` require explicit user approval
- direct commits to `main` require explicit user approval
- do not run `git push` or any other command that updates the remote; the user will handle pushes
- `git fetch`, `git pull`, and local inspection commands are allowed

Turn execution rules must follow this rule:

- work should continue across multiple tasks in the same turn when the user intent is clear
- multiple commits in the same turn are allowed when they reflect coherent task boundaries on the current epic branch
- only stop for user input when a meaningful decision needs explicit approval or when the user's intent is genuinely unclear

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

## UX Copy And Design Guardrails

- UI copy should be user-facing and functional, not commentary about the app's design, architecture, implementation choices, or product philosophy.
- Do not add explanatory lines such as references to "control panels", "built on Better Auth", "security baseline", or similar internal framing unless the user explicitly asks for that context.
- Prefer short, direct labels and descriptions that help the user complete the task on screen.
- When extending or adding new screens, match the visual language of the existing product and avoid introducing new layout or tone patterns without checking nearby pages first.

## Product Shape

The product is expected to support:

- public project discovery and marketing pages
- donor authentication and payments
- Creative Evangelist self-service editing and management
- employee approval, publishing, and oversight workflows

Operational workflows outside the site may continue to live in Notion. The site should focus on product-critical workflow steps rather than becoming a full internal ops platform.
