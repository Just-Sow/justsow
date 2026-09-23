# Static Pages CMS

## Objective

Let editors manage static public pages, reusable sections, and public-site navigation in Sanity while preserving the web app and API as the source of truth for product workflows.

## Scope

- establish a standalone Sanity Studio in the monorepo and its local/deployment configuration
- define page documents with single-segment slugs, SEO metadata, and an ordered array of approved reusable section types
- support editor-created static pages through a SvelteKit CMS page route, with reserved app routes protected from slug collisions
- model editable header navigation and footer link groups that can link to CMS pages and approved app routes
- migrate the About page first; its initial content will be managed as a Sanity page document
- keep page-owned copy and images in Sanity while shared layout, route behavior, and interactions stay app-owned
- implement reusable section renderers for image-background, image-and-text, and icon/feature sections
- let editors choose supported image placement (left/right) and text alignment (left/center/right) without exposing arbitrary layout or styling controls
- integrate Sanity Presentation Tool with secure SvelteKit preview mode and live, in-context editing
- keep public visitors on published content while allowing authorized editors to see draft changes in the Studio preview
- return a 404 for a missing or unpublished page document, and surface CMS fetch failures as an error; do not silently fall back to hard-coded page copy
- establish public-page SEO metadata conventions and apply them to CMS-backed pages
- document environment setup and required Sanity project/dataset configuration

## Non-Goals

- project submissions, listings, approval, revisions, or publishing state
- user, donor, employee, or account data
- contact-form submission behavior or other transactional UI
- login, signup, account, basket, and other app-owned action controls in the header
- replacing the app's shared layout or interactive page components with arbitrary CMS layouts
- project/workflow image storage strategy
- nested CMS page paths; the initial route model uses one path segment and can be extended later

## Dependencies

- Sanity project and dataset created or selected
- project ID, dataset, and required CORS origins available for environment configuration
- agreement on the first routes and content fields to migrate
- deployment target for the standalone Studio
- a least-privilege Sanity token/configuration for querying drafts in editor-only preview mode

## Open Questions

- which app-owned routes are safe and appropriate targets for editor-managed navigation links
- where the standalone Studio will be hosted and who can publish content
- how Sanity project credentials and per-environment datasets will be provisioned

## Acceptance Criteria

- editors can create and publish content for the agreed static routes in Sanity Studio
- editors can create static pages from the approved section types and control their single-segment public slug and navigation placement
- the About page is rendered from Sanity using the reusable section renderer
- editors can change header navigation and footer links without changing app-owned login/account/action controls
- editors can preview draft changes in the Studio and edit page content in context, with updates appearing live
- public routes render published CMS content and preserve their existing app-owned interactions
- draft content is not exposed to public visitors
- missing or unpublished page documents return a 404; CMS fetch failures show an error rather than stale hard-coded content
- SEO metadata for migrated routes is unique and follows a documented convention
- project and workflow data continue to come from the app/API
- local setup, CORS, environment variables, and Studio deployment are documented

## Status

In Progress

## Progress

- Added the standalone Studio package and initial schemas for pages, reusable sections, and header/footer navigation.
- The user tested the Studio authoring model and confirmed it looks good; no schema changes are requested before frontend integration.
- Resume here: inspect the current About page and shared header/footer, then connect SvelteKit to published Sanity content and render the About page through the reusable section components.
- After published rendering works, add the secure editor-only draft preview and Presentation Tool live editing. Keep draft access restricted; public visitors must only receive published content.
- Then migrate the About content, validate not-found and CMS-error behavior, and document the real project/dataset, CORS, preview, and Studio hosting configuration.
