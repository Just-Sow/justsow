# Target Architecture

## Product Shape

The system should be treated as one product with multiple user capabilities rather than as a marketing site with a separate side dashboard.

Primary capability areas:

- public site
- Creative Evangelist workflows
- sower account workflows
- employee review and publishing workflows

## Repo Shape

Expected monorepo structure:

```text
apps/
  web/
  api/
packages/
  shared/
docs/
```

## Application Boundaries

### Web

The web app should contain:

- public pages and project discovery
- authenticated Creative Evangelist flows
- authenticated sower flows
- authenticated employee flows

Separate route groups are preferable to separate apps at MVP stage.

### API

The API should be organized around domains, not generic technical layers alone.

Expected domain areas:

- auth
- users
- roles
- projects
- project revisions
- sowers
- seeds
- approvals
- notifications
- media
- audit

Auth and session management should live here as well, with the API acting as the source of truth for account lifecycle and role-aware authorization.

### Shared Package

The first shared package should likely hold:

- enums and constants
- shared Zod schemas
- role and status definitions
- API DTOs

### Editorial Content

- Sanity is planned to manage static public-page content, its editorial media, and header/footer public-content navigation.
- The web app remains responsible for page rendering, route behavior, and interactive forms.
- CMS-authored pages use a finite set of reusable, typed section renderers rather than arbitrary layout or styling instructions.
- Authentication, account, basket, and other functional header actions remain app-owned.
- Project submissions, approvals, publishing state, user data, and other workflow records remain owned by the app/API; Sanity is not their source of truth.
- CMS-backed SEO metadata should follow the public-site conventions defined by the static-pages CMS workstream.

## Workflow Design Consequences

The requirement that all owner edits require approval means the backend should support a distinction between:

- live published project data
- proposed changes awaiting review

That can be implemented either through:

- separate revision tables
- versioned snapshots
- change-set records

Whatever approach is chosen, direct in-place mutation of live published project content by Creative Evangelists is the wrong model.

## Identity And Authorization

- users may have multiple roles
- role assignment should be many-to-many
- authorization checks should be capability-based
- account claiming for manual sower records must be supported cleanly

## Infrastructure Direction

Initial direction:

- likely EC2 + RDS for early production due to cost and simplicity
- revisit infrastructure only when traffic, latency, or operational constraints justify it

For local development, PostgreSQL should run on the developer machine via `docker compose` rather than relying on a shared live environment.

This is a direction, not a final infrastructure commitment.
