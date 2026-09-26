import { handlePreviewMode, handleQueryLoader, setServerClient } from '@sanity/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';
import { sanityServerClient } from '$lib/sanity/client.server.js';
import { safePreviewRedirect } from '$lib/sanity/preview-redirect.js';

setServerClient(sanityServerClient);

const handleSafePreviewDisable: Handle = async ({ event, resolve }) => {
	if (event.url.pathname !== '/preview/disable') return resolve(event);

	event.cookies.delete('__sanity_preview', { path: '/' });
	event.cookies.delete('sanity-preview-perspective', { path: '/' });

	redirect(303, safePreviewRedirect(event.url.searchParams.get('redirect'), event.url.origin));
};

const handleNoStorePreview: Handle = ({ event, resolve }) => {
	if (event.locals.sanity?.previewEnabled) {
		event.setHeaders({ 'cache-control': 'private, no-store, max-age=0' });
	}
	return resolve(event);
};

export const handle = sequence(
	handleSafePreviewDisable,
	handlePreviewMode({
		client: sanityServerClient,
		preview: { redirect, secret: env.SANITY_PREVIEW_SECRET }
	}),
	handleNoStorePreview,
	handleQueryLoader()
);
