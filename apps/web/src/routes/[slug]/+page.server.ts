import { error } from '@sveltejs/kit';
import { cmsPageQuery } from '$lib/sanity/queries.js';
import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { loadQuery, previewEnabled } = locals.sanity;
	const initial = await loadQuery<CmsPageQueryResult>(
		cmsPageQuery,
		{ slug: params.slug },
		{
			stega: previewEnabled
		}
	);

	if (!initial.data) error(404, 'Page not found');

	return {
		query: cmsPageQuery,
		params: { slug: params.slug },
		options: { initial }
	};
};
