import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { contactPageQuery } from '$lib/sanity/queries.js';
import type { ContactPageQueryResult } from '$lib/sanity/sanity.types';

export const load: PageServerLoad = async ({ locals }) => {
	const { loadQuery, previewEnabled } = locals.sanity;
	const initial = await loadQuery<ContactPageQueryResult>(
		contactPageQuery,
		{},
		{ stega: previewEnabled }
	);

	if (!initial.data) error(503, 'Contact page content is not published');

	return {
		query: contactPageQuery,
		params: {},
		options: { initial }
	};
};
