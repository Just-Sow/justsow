import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';
import type { AuthViewer } from '$lib/auth/session.js';

const apiOrigin = env.JUSTSOW_API_ORIGIN || 'http://127.0.0.1:3000';

export const load: LayoutServerLoad = async ({ fetch, request, locals }) => {
	const previewEnabled = locals.sanity.previewEnabled;
	const cookie = request.headers.get('cookie');

	if (!cookie) {
		return {
			auth: null satisfies AuthViewer | null,
			previewEnabled
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
				previewEnabled
			};
		}

		const auth = (await response.json()) as AuthViewer;

		return {
			auth,
			previewEnabled
		};
	} catch {
		return {
			auth: null satisfies AuthViewer | null,
			previewEnabled
		};
	}
};
