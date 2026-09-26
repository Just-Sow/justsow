import { createClient } from '@sanity/sveltekit';
import {
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_STUDIO_URL
} from '$env/static/public';

export const sanityClient = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2026-07-01',
	useCdn: true,
	stega: {
		enabled: true,
		studioUrl: PUBLIC_SANITY_STUDIO_URL
	}
});
