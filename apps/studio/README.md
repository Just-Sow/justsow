# JustSow Sanity Studio

This standalone Studio contains the editorial schemas for static pages, reusable sections, and public navigation. It does not manage project or account workflows.

## Local setup

1. Create or select the JustSow project in [Sanity Manage](https://www.sanity.io/manage) and note its project ID.
2. Copy `.env.example` to `.env` and set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.
3. From the repository root, run `pnpm install` and `pnpm studio:dev`.
4. Open `http://localhost:3333` and sign in with a Sanity user who has access to the project.
5. Add `http://localhost:3333` as a CORS origin in the Sanity project's API settings. When the web preview is integrated, also allow its origin with credentials as documented in the web setup.

## Content model

- **Pages** have a single-segment slug, SEO fields, and an ordered list of sections.
- **Sections** currently include image-background, image-and-text, and features layouts. Alignment, image placement, and feature icons are constrained to supported options.
- **Site navigation** is a singleton document for header links and grouped footer links. Links can target a CMS page, an approved public app route, or an HTTP(S) URL.

The initial content migration is the About page. SvelteKit rendering, secure draft preview, and Presentation Tool live editing are the next setup step; the Studio preview is not connected yet.

Use `pnpm dev` to start the web app and API. Use `pnpm dev:cms` to start those services together with the Studio after the project environment is configured.
