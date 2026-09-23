# Backlog

## Highest Priority

- define shared domain model for users, roles, projects, revisions, sowers, seeds, and audit events
- define auth and account lifecycle architecture
- define project revision approval model in enough detail to drive schema design

## Near-Term

- create shared package for role, status, and API contract definitions
- define employee workflow boundaries in the web app
- define site-wide SEO metadata conventions and clean up route metadata remnants
- define media storage and thumbnail strategy for MVP
- add a branded 404 page and fallback navigation treatment for placeholder public routes
- recheck pnpm 12 multi-document lockfile support and GitHub dependency graph detection; once supported end to end, remove `pmOnFail: ignore` and this item
- remove the esbuild override once stable `drizzle-kit` no longer depends on deprecated `@esbuild-kit/esm-loader` ([drizzle-team/drizzle-orm#5145](https://github.com/drizzle-team/drizzle-orm/issues/5145))
- polish responsive project discovery controls:
	- close the mobile navigation when users click outside it
	- make the header and mobile menu fully opaque against page content
	- separate the Map/Card view selector from the project filters
	- apply the active project filters to both card and map views
	- open map pin details in a mobile drawer with the same project actions and content as desktop

## Medium-Term

- implement sower account claiming flow
- design case study publishing workflow
- define initial production deployment runbooks

## Later

- on-site payment architecture and provider decision
- richer donor account capabilities
- regional expansion refinements
- refreshed hosting and cost analysis
