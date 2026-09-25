# 0009: Static Page Content Management

## Status

Accepted

## Decision

Use Sanity as the editorial CMS for static public-site pages, related marketing media, and header/footer public-content navigation. Pages are composed from a finite set of reusable, typed sections. Initial editor-created pages use single-segment paths. Keep page rendering and interactive behavior in the SvelteKit app. Keep projects, submissions, approvals, publishing state, users, and other operational records owned by the app/API.

For the SvelteKit integration, use Sanity's [`@sanity/sveltekit` package](https://www.sanity.io/docs/visual-editing/visual-editing-with-sveltekit) for typed queries, preview mode, and Visual Editing. Keep each page section renderer in its own Svelte component, with a small page-section registry mapping Sanity section types to those components. Render rich text with the Portable Text Svelte renderer. Generate query types from the Studio schemas with [Sanity TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen).

Exact app-owned routes take precedence over the CMS single-segment route. Keep the reserved app route slugs in `@justsow/shared`, use them to validate Studio page slugs, and test that every static single-segment web route is represented there. During About migration, keep `about` reserved and let editors test the CMS renderer with a temporary slug such as `new-about`; remove the `about` reservation only when the app-owned About route has been replaced by the published CMS page.

## Why

- static marketing content needs an editorial workflow without turning the product app into an internal content-management system
- project content participates in moderation and audit workflows that must remain app-controlled

## Constraints

- scope the first delivery to explicitly agreed public static pages and fields
- do not move forms, account flows, project discovery data, or workflow state into Sanity
- keep authentication, account, basket, and other functional header controls in the app, separate from CMS-managed public navigation links
- expose only approved section types and presentation options to editors; do not allow arbitrary layouts or styles
- keep the Studio standalone within the monorepo unless deployment constraints justify another shape
- allow draft reads only through an authorized editor preview session; public visitors receive published content only
- keep public reads on the published perspective and enable draft reads only after Sanity's preview secret has been validated server-side
- store the Sanity viewer token only in server-side environment configuration; never send it to the browser
- keep Sanity section schemas and their Svelte renderers paired by type, with shared image, link, and Portable Text helpers kept separate from general UI primitives
- keep CMS-reserved slugs synchronized with app-owned static paths through the shared route registry; Studio validation must report collisions and prevent publishing a conflicting CMS page
- do not silently mask a missing page or CMS outage with hard-coded content
