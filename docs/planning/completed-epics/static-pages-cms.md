# Static Pages CMS

## Objective

Let editors manage static public pages, reusable sections, and public-site navigation in Sanity while preserving the web app and API as the source of truth for product workflows.

## Scope

- establish a standalone Sanity Studio in the monorepo and its local/deployment configuration
- define page documents with single-segment slugs, SEO metadata, and an ordered array of approved reusable section types
- support editor-created static pages through a SvelteKit CMS page route, with reserved app routes protected from slug collisions
- model editable header navigation and footer link groups with unified internal-page and external-website destinations
- migrate the About page first; its initial content will be managed as a Sanity page document
- keep page-owned copy and images in Sanity while shared layout, route behavior, and interactions stay app-owned
- implement reusable section renderers for image-background, image-and-text, and icon/feature sections
- let editors choose supported image placement (left/right) and text alignment (left/center/right) without exposing arbitrary layout or styling controls
- integrate Sanity Presentation Tool with secure SvelteKit preview mode and live, in-context editing
- keep public visitors on published content while allowing authorized editors to see draft changes in the Studio preview
- return a 404 for a missing or unpublished page document, and surface CMS fetch failures as an error; do not silently fall back to hard-coded page copy
- establish public-page SEO metadata conventions and apply them to CMS-backed pages
- document environment setup and required Sanity project/dataset configuration
- extend editorial content to the existing Home and Contact routes with route-specific singleton documents, while leaving project discovery and the Contact form app-owned

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

- where the standalone Studio will be hosted and who can publish content
- how Sanity project credentials and per-environment datasets will be provisioned
- which public app route should the About page's current “Apply Now” action target, since `/apply` is not currently an app route

## Proposed Integration Architecture

Keep Sanity schemas as the content contract and SvelteKit as the presentation and routing layer. Use Sanity's maintained `@sanity/sveltekit` integration rather than hand-built Content Lake HTTP requests. Define named GROQ queries with `defineQuery`, and generate query result types from the Studio schemas with Sanity TypeGen.

Keep each CMS section in an individual Svelte file under `apps/web/src/lib/components/cms/sections/`, paired by Sanity `_type` with the section schema file under `apps/studio/schema-types/sections/`. A small `PageSections.svelte` renderer switches over the typed section union. Put shared Portable Text, Sanity image, and CMS link renderers in sibling CMS components; keep them separate from the general-purpose `ui/` component library. Render Portable Text with `@portabletext/svelte` and build image URLs from Sanity image references so hotspot cropping and responsive sizes are honored.

Use one single-segment `[slug]` route for editor-created pages. Exact app routes continue to win through SvelteKit route precedence. Define app-owned paths and their labels in `@justsow/shared`; Studio slug validation reads the same registry and prevents publishing a colliding page. A web test compares the static single-segment SvelteKit routes to the registry so future app routes cannot silently become CMS-overridable. New non-reserved slugs must work from content alone, with no route allowlist or code change. A missing published page is a 404; a Sanity request failure is an error.

Public requests use the published perspective and CDN. Preview requests use the server-side viewer token only after the Presentation Tool preview secret is validated by Sanity's SvelteKit preview integration. Enable Visual Editing only for a validated preview session. Configure Presentation Tool document locations for `/:slug`, and explicitly allow the local and deployed web origins in the Studio preview configuration and Sanity CORS settings. Follow Sanity's [Presentation Tool setup](https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool) and [secure draft mode flow](https://www.sanity.io/docs/visual-editing/implementing-draft-mode).

Keep `/` and `/contact` as app-owned routes and load their editorial content from dedicated Sanity singleton documents. Do not route these pages through the generic `[slug]` renderer. The Contact document owns the page heading, introduction, and email; the app owns fixed social links and the contact form, including its fields, validation, submission behavior, and status messages. The Home document owns the hero and mission/marketing sections, including their copy, images, and approved calls to action. Keep project discovery, project data, map/card controls, basket behavior, and funding interactions app-owned; page copy around that workflow can be CMS-managed without moving project data into Sanity. Reuse the approved section renderer where its presentation matches, adding narrowly scoped schemas/renderers only for layouts that do not fit.

### Delivery sequence

1. **Shared route contract (implemented and unit-tested).** The `@justsow/shared` app-owned route registry, Studio slug validation, and route coverage test cover every current static single-segment route and the reserved `/contact` slug.
2. **Reusable section renderers (implemented; visual review remains).** About, Home, and Contact use the approved schemas and typed renderers, including Portable Text, images, links, and icons. Review the actual published and previewed pages at mobile and desktop sizes.
3. **CMS route and errors (implemented and locally tested).** The official SvelteKit integration, queries, TypeGen, and generic route are in place. Unit tests cover editor-created slugs, missing pages, Sanity request failures, singleton content failures, and preview stega. A shared branded error page handles 404 and server errors without showing backend details. Confirm routing and error behavior again against hosted Sanity content.
4. **About migration (complete).** `/about` is served from its Sanity page document; the legacy route and hard-coded fallback are removed.
5. **Public navigation (implemented and browser-tested).** CMS navigation drives header and footer while app-owned controls remain in the app. Browser tests cover internal and external links, safe new-tab attributes, and missing destinations. Confirm editor-authored links and empty navigation on the hosted dataset.
6. **Secure preview (implemented; hosted verification remains).** The Presentation Tool, server-only viewer token, validated preview URL, draft perspective, preview cookies, overlays, edit locations, and Disable preview control are configured. Preview responses set `private, no-store`; the Disable preview redirect is constrained to same-origin paths and clears the preview cookies. Unit tests cover same-origin and hostile redirect inputs. Verify invalid preview requests are rejected, draft content is never returned to non-preview visitors or shared caches, and confirm shared preview access is disabled unless explicitly intended.
7. **Release verification (post-epic).** Connect the Studio Presentation Tool to the Vercel preview deployment. Confirm the deployed URL, environment variables, datasets, CORS and preview origins, Studio hosting, and token provisioning. Use a dedicated server-only read token with no write/publish permissions. Verify deployed preview entry/exit, published/draft separation, editor-authored navigation and CTA destinations, and responsive pages. Confirm who can publish and document the deployed setup. Track any deployment remediation on a follow-up fix branch. Local lint, typecheck, unit tests, browser tests, and build are part of the completion gate; the local build uses `adapter-auto`, so Vercel adapter selection is confirmed in the hosted build.
8. **Home and Contact (implemented; content and visual verification remain).** Singleton schemas and queries support the editable content and CTA lists; project discovery, fixed social links, and the Contact form remain app-owned. Verify required module placement, published content, metadata, draft preview, and responsive rendering.

## Acceptance Criteria

- editors can create and publish content for the agreed static routes in Sanity Studio
- editors can create static pages from the approved section types and control their single-segment public slug and navigation placement
- editor-created pages can use arbitrary non-reserved slugs without application code changes
- Studio validation blocks publishing CMS pages whose slug is reserved by an app-owned route, and a route-registry test detects newly added static routes missing from that reservation list
- `/about` is served by its published CMS page through the generic page route
- the About page is rendered from Sanity using the reusable section renderer
- editors can change header navigation and footer links without changing app-owned login/account/action controls
- editors can add, remove, and reorder approved sections on Home and Contact; Home requires one hero and one Project Discovery module, while Contact requires one Contact Details and Form section
- Home Project Discovery remains an app-owned renderer and data source even when editors move its section slot; Contact form fields and behavior remain app-owned inside the required contact panel
- editors can preview draft changes in the Studio and edit page content in context, with updates appearing live
- public routes render published CMS content and preserve their existing app-owned interactions
- draft content is not exposed to public visitors
- missing or unpublished page documents return a 404; CMS fetch failures show an error rather than stale hard-coded content
- SEO metadata for migrated routes is unique and follows a documented convention
- project and workflow data continue to come from the app/API
- local setup, CORS, environment variables, and Studio deployment are documented

## Status

Complete

## Progress

- The generic `[slug]` route serves Static Pages such as About. Home and Contact use dedicated Sanity singleton documents with app-owned project discovery and contact-form modules. Published routes do not fall back to hardcoded page copy.
- The Sanity navigation document drives header and footer links. Preview uses the protected server-side draft flow and includes a **Disable preview** control.
- Editors can reorder approved page sections and control section colour, alignment, image crop/hotspot, icons, rich text, and optional CTA lists. CTA styles are Primary, Secondary, Outline, or Match section.
- Home and Contact editorial fields are CMS-managed; Contact social links, the Contact form, and Home project discovery remain app-owned.
- Removed obsolete homepage/About assets, the unused seed graphic, the old internal-route navigation option, the old basket storage-key fallback, the single-CTA compatibility field, and temporary planning notes.
- Security review found that the package's default preview-disable endpoint accepted an arbitrary `redirect` URL. The web hook now handles preview exit first, limits redirects to same-origin paths, clears both preview cookies, and applies `private, no-store` to validated preview responses.
- Added a branded 404/server-error page, unit coverage for generic and singleton CMS route failures, preview redirect safety tests, and browser coverage for CMS section rendering and internal/external navigation. Updated the Contact browser fixture to provide CMS-managed content.
- Local implementation and validation are complete. Hosted Sanity/Vercel configuration and release verification follow during deployment; any fixes will be handled on a follow-up branch.
- Existing CTA content must use the new CTA list fields.
