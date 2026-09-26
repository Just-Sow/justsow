import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';
import type { AuthViewer } from '$lib/auth/session.js';
import { siteNavigationQuery } from '$lib/sanity/queries.js';
import type { SiteNavigationQueryResult } from '$lib/sanity/sanity.types';

const apiOrigin = env.JUSTSOW_API_ORIGIN || 'http://127.0.0.1:3000';

export const load: LayoutServerLoad = async ({ fetch, request, locals }) => {
	const previewEnabled = locals.sanity.previewEnabled;
	let navigation: SiteNavigationQueryResult = null;
	try {
		navigation = (
			await locals.sanity.loadQuery<SiteNavigationQueryResult>(
				siteNavigationQuery,
				{},
				{
					stega: previewEnabled
				}
			)
		).data;
	} catch {
		// Navigation is optional; a Sanity outage should not take down app-owned routes.
	}
	const cookie = request.headers.get('cookie');

	if (!cookie) {
		return {
			auth: null satisfies AuthViewer | null,
			previewEnabled,
			navigation
		};
	}

	try {
		const response = await fetch(`${apiOrigin}/auth/me`, {
			headers: {
				cookie
			}
		});

		if (!response.ok) {
			return {
				auth: null satisfies AuthViewer | null,
				previewEnabled,
				navigation
			};
		}

		const auth = (await response.json()) as AuthViewer;

		return {
			auth,
			previewEnabled,
			navigation
		};
	} catch {
		return {
			auth: null satisfies AuthViewer | null,
			previewEnabled,
			navigation
		};
	}
};
