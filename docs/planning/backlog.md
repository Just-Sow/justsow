# Backlog

## Highest Priority

- define shared domain model for users, roles, projects, revisions, sowers, seeds, and audit events
- define auth and account lifecycle architecture
- define project revision approval model in enough detail to drive schema design
- define how project data represents multiple predefined-amount funding commitments, manual bank-transfer follow-up, and confirmed contributions/seeds

## Near-Term

- create shared package for role, status, and API contract definitions
- define employee workflow boundaries in the web app
- select and integrate a transactional email provider/API for account, project-workflow, and future funding-commitment messages
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

## Candidate Future Epic: Projects And Funding Commitments

This is a backlog cluster, not a commitment that all items belong in the next epic. It follows the mockup interactions tracked in [UI MVP Funding Interactions](active-epics/ui-mvp-funding-interactions.md).

- decide the project data model, API boundaries, lifecycle, and relationship between project applications, approved public versions, revisions, funding commitments, sowers, and allocated seeds
- replace mock project data with backend-backed project records and connect the homepage project grid/map to published API data
- build full public project detail pages for published projects
- replace the demo basket persistence with shared, properly managed basket state surfaced in the site header and usable from project cards and detail pages
- add a review-basket and checkout flow that records a funding commitment but does not process a payment
- after commitment, send the sower a receipt/confirmation listing the projects and seed amounts they committed to
- notify gatekeepers so staff can manually coordinate the sower, project owner, and offline bank transfer; do not collect or process bank details/payments in checkout
- define the staff workflow and audit/status model for pending commitments and their later connection to sower/project seed records
- use the transactional email provider/API selected in the near-term backlog item for these notifications
