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
