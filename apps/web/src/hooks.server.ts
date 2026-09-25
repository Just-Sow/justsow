import { handlePreviewMode, handleQueryLoader, setServerClient } from '@sanity/sveltekit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';
import { sanityServerClient } from '$lib/sanity/client.server.js';

setServerClient(sanityServerClient);

export const handle = sequence(
	handlePreviewMode({
		client: sanityServerClient,
		preview: { redirect, secret: env.SANITY_PREVIEW_SECRET }
	}),
	handleQueryLoader()
);
