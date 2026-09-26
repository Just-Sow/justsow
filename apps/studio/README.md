# JustSow Sanity Studio

This standalone Studio contains the editorial schemas for static pages, reusable sections, and public navigation. It does not manage project or account workflows.

## Local setup

1. Create or select the JustSow project in [Sanity Manage](https://www.sanity.io/manage) and note its project ID.
2. Copy `.env.example` to `.env` and set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.
3. From the repository root, run `pnpm install` and `pnpm studio:dev`.
4. Open `http://localhost:3333` and sign in with a Sanity user who has access to the project.
5. Add `http://127.0.0.1:3333` as a CORS origin in the Sanity project's API settings. Add the web origin (normally `http://127.0.0.1:5173`) with credentials enabled for Presentation Tool preview.

## Content model

- **Static Pages** have a single-segment slug, SEO fields, and an ordered list of sections.
- **Sections** currently include image-background, image-and-text, and features layouts. Alignment, image placement, and feature icons are constrained to supported options.
- **Site navigation** is a singleton document for header links and grouped footer links. Links can target an internal page or an HTTP(S) external website.

Home and Contact use dedicated singleton documents because they contain app-owned interactive modules. About and other editor-managed pages use **Static Pages** and are served by the generated page route. Studio validation rejects slugs reserved for app-owned routes.

Each page section has its own schema file under `schema-types/sections/` and its own Svelte renderer in the web app. The Presentation Tool opens the configured SvelteKit URL and activates the app's `/preview/enable` endpoint. For draft preview, configure `SANITY_VIEWER_TOKEN` and a stable `SANITY_PREVIEW_SECRET` in the web app's server environment, and allow the web origin with credentials in the Sanity CORS settings. The token stays server-side; React and React DOM are peer dependencies used by Sanity's Visual Editing overlay implementation, while the site UI and renderers remain Svelte.

Use `pnpm dev` to start the web app and API. Use `pnpm dev:cms` to start those services together with the Studio after the project environment is configured.
