# JustSow Web

This is the SvelteKit web app for JustSow.

## Tech Stack Overview

- **Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Svelte stores
- **Icons:** [Unplugin Icons](https://iconify.design/docs/unplugin-icons/) + Iconify
- **UI Components:** [shadcn-svelte](https://shadcn-svelte.com/)
  All components live in `src/lib/components/ui`
- **Build & Dev Tools:** Vite (bundler included with SvelteKit)
- **Linting/Formatting:** ESLint, Prettier

## Scripts

Use root workspace commands where possible:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`

## Notes

- **Icons** are handled with Unplugin Icons / Iconify; import icons as needed.
- **UI components** are centralized in `src/lib/components/ui` using shadcn conventions.
- `pnpm test` runs unit tests only. Use `pnpm test:browser` for browser coverage and run `pnpm test:setup` first if Chromium is not already installed.

## Sanity pages

The CMS page route is `src/routes/[slug]`; it resolves any published, non-reserved slug from Sanity. `/about` remains app-owned during the transition, so use a temporary page such as `/new-about` to exercise the CMS route. Create and publish that page in Studio; it is not defined in app code.

Each CMS section has its own Svelte component under `src/lib/components/cms/sections`. Shared Portable Text, image, and link components live under `src/lib/components/cms`. App-owned route slugs are maintained in `@justsow/shared` and validated by Studio; tests check that static single-segment SvelteKit routes are reserved.

For local web reads, copy `.env.example` to `apps/web/.env` and use the same project ID and dataset as the Studio. The viewer token and preview secret are only needed when editor preview is enabled; keep them server-side.
