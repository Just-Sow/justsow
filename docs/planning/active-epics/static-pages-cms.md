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
- which public app route should the About page's current “Apply Now” action target, since `/apply` is not currently an app route

## Proposed Integration Architecture

Keep Sanity schemas as the content contract and SvelteKit as the presentation and routing layer. Use Sanity's maintained `@sanity/sveltekit` integration rather than hand-built Content Lake HTTP requests. Define named GROQ queries with `defineQuery`, and generate query result types from the Studio schemas with Sanity TypeGen.

Keep each CMS section in an individual Svelte file under `apps/web/src/lib/components/cms/sections/`, paired by Sanity `_type` with the section schema file under `apps/studio/schema-types/sections/`. A small `PageSections.svelte` renderer switches over the typed section union. Put shared Portable Text, Sanity image, and CMS link renderers in sibling CMS components; keep them separate from the general-purpose `ui/` component library. Render Portable Text with `@portabletext/svelte` and build image URLs from Sanity image references so hotspot cropping and responsive sizes are honored.

Use one single-segment `[slug]` route for editor-created pages. Exact app routes continue to win through SvelteKit route precedence. Define app-owned paths and their labels in `@justsow/shared`; Studio slug validation reads the same registry and prevents publishing a colliding page. A web test compares the static single-segment SvelteKit routes to the registry so future app routes cannot silently become CMS-overridable. New non-reserved slugs must work from content alone, with no route allowlist or code change. A missing published page is a 404; a Sanity request failure is an error.

Public requests use the published perspective and CDN. Preview requests use the server-side viewer token only after the Presentation Tool preview secret is validated by Sanity's SvelteKit preview integration. Enable Visual Editing only for a validated preview session. Configure Presentation Tool document locations for `/:slug`, and explicitly allow the local and deployed web origins in the Studio preview configuration and Sanity CORS settings. Follow Sanity's [Presentation Tool setup](https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool) and [secure draft mode flow](https://www.sanity.io/docs/visual-editing/implementing-draft-mode).

### Delivery sequence

1. **Lock the shared route contract.** Add the app-owned route registry to `@justsow/shared`, including human-readable collision messages. Have Studio validation reject those slugs and add a web test that every static single-segment route is registered. Exact app routes remain the runtime priority.
2. **Build reusable renderers.** Keep the reviewed image-background, image-and-text, and features schemas as the initial set. Map About's story, purpose, how-we-work, and vision content onto those sections. Build one Svelte file per section plus shared Portable Text, image, and CMS link components. Adjust schemas only if the content mapping exposes a missing reusable pattern.
3. **Build and verify the CMS route.** Add the official SvelteKit integration, private/public Sanity configuration, named queries, TypeGen, and the single-segment route. Leave the existing `/about` page untouched. Manually create `/new-about` in Studio as the transition page and verify published rendering, 404s, CMS errors, section rendering, arbitrary new slugs, hardcoded route precedence, and collision validation.
4. **Migrate About in Studio and switch routes.** Manually create and publish `/about` using the same reusable sections. First point the existing `/about` route at the CMS document and verify copy, image alt text, mobile layout, CTA destination, SEO, and published rendering. Then remove its legacy component and remove `about` from the shared reserved route registry so the generic CMS route owns it. Do not maintain a silent hard-coded fallback.
5. **Move public navigation.** Fetch header/footer CMS links in the shared layout while retaining app-owned account and action controls. Validate page references, approved app routes, external links, and missing navigation data.
6. **Add secure preview and in-context editing.** Configure the Presentation Tool, preview URL secret validation, server-only viewer token, draft perspective, preview cookie, Visual Editing overlays, edit locations, and an explicit way to leave preview. Verify that public requests never receive draft data.
7. **Document and validate release setup.** Record local and deployed environment variables, datasets, CORS origins, preview origins, Studio hosting, and token permissions. Run the full validation gate, including browser tests for dynamic routing, missing pages, public/draft separation, and visual editing.

## Acceptance Criteria

- editors can create and publish content for the agreed static routes in Sanity Studio
- editors can create static pages from the approved section types and control their single-segment public slug and navigation placement
- editor-created pages can use arbitrary non-reserved slugs without application code changes
- Studio validation blocks publishing CMS pages whose slug is reserved by an app-owned route, and a route-registry test detects newly added static routes missing from that reservation list
- during migration `/about` stays hardcoded while `/new-about` exercises the CMS; final `/about` is migrated only after its CMS document is published and verified
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
- The user approved the architecture in decision 0009: official SvelteKit integration, generated query types, individual section components, a shared app-route registry, and a protected preview flow.
- Steps 1 and 2 are implemented. Step 3 has a dynamic `[slug]` route, published-content query, typed modular section renderers, and unit coverage for the route and reservation behavior. `/about` remains app-owned and reserved. Transition pages such as `/new-about` are created by editors in Sanity, never hardcoded or seeded by the app.
- The SvelteKit web app follows Sanity's Query Loader guide. Local Studio and web origins have been configured in Sanity, and the editor confirmed the Presentation Tool preview works after aligning the local hostnames.
- The editor created and published `/new-about` in Studio and verified it renders through the dynamic route. The Presentation Tool preview works after aligning the local hostnames.
- The existing About page remains the live implementation. The user will create the About page in Sanity manually from the reusable sections; do not remove the current page until the published CMS version has been verified.
- Remaining route checks include reserved-slug validation and missing/fetch-error behavior. Navigation editing and the final About migration remain subsequent work.
- **Pickup:** first move public header links and footer link groups to the existing Sanity navigation document, keeping account and action controls app-owned. Then use the manual About migration and additional editor-authored pages to test section renderers with varied copy, images, and layouts. Work through the CMS section authoring and responsive polish backlog: responsiveness, constrained editor colour choices, optional/multiple CTAs, richer text only where needed, image crop behavior, surfaced versus transparent image sections, and an editor-friendly icon selection model. Keep `/about` app-owned until its Sanity version is published and verified; then follow delivery step 4.
