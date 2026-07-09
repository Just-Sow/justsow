import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { AuthSecurityViewer } from '$lib/auth/session.js';

const apiOrigin = env.JUSTSOW_API_ORIGIN || 'http://127.0.0.1:3000';

export const load: LayoutServerLoad = async ({ parent, fetch, request }) => {
	const { auth } = await parent();

	if (!auth) {
		throw redirect(303, '/login');
	}

	const cookie = request.headers.get('cookie') ?? '';
	const securityResponse = await fetch(`${apiOrigin}/auth/security`, {
		headers: {
			cookie
		}
	});

	return {
		security: securityResponse.ok ? ((await securityResponse.json()) as AuthSecurityViewer) : null
	};
};
