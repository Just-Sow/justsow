import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { homePageQuery } from '$lib/sanity/queries.js';
import type { HomePageQueryResult } from '$lib/sanity/sanity.types';

export const load: PageServerLoad = async ({ locals }) => {
	const { loadQuery, previewEnabled } = locals.sanity;
	const initial = await loadQuery<HomePageQueryResult>(
		homePageQuery,
		{},
		{ stega: previewEnabled }
	);

	if (!initial.data) error(503, 'Home page content is not published');

	return {
		query: homePageQuery,
		params: {},
		options: { initial }
	};
};
