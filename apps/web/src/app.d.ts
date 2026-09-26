// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import 'unplugin-icons/types/svelte';
import type { SanityLocals } from '@sanity/sveltekit';

declare global {
	namespace App {
		// SvelteKit requires this empty interface for application type augmentation.
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface Locals extends SanityLocals {}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

/// <reference types="unplugin-icons/types/svelte" />
