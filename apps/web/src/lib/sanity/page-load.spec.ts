import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/sanity/queries.js', () => ({
	cmsPageQuery: 'cms-page-query',
	homePageQuery: 'home-page-query',
	contactPageQuery: 'contact-page-query'
}));

import { load } from '../../routes/[slug]/+page.server';
import { load as loadHome } from '../../routes/+page.server';
import { load as loadContact } from '../../routes/contact/+page.server';

describe('CMS page route', () => {
	it('loads an editor-created page using its slug', async () => {
		const page = { _id: 'page-test', title: 'Test page', sections: [] };
		const loadQuery = vi.fn().mockResolvedValue({ data: page });
		const result = await load({
			locals: { sanity: { loadQuery, previewEnabled: false } },
			params: { slug: 'new-about' }
		} as never);

		expect(loadQuery).toHaveBeenCalledWith(
			expect.any(String),
			{ slug: 'new-about' },
			{
				stega: false
			}
		);
		expect(result).toMatchObject({ options: { initial: { data: page } } });
	});

	it('returns 404 when the requested page is not published', async () => {
		const loadQuery = vi.fn().mockResolvedValue({ data: null });

		await expect(
			load({
				locals: { sanity: { loadQuery, previewEnabled: false } },
				params: { slug: 'missing' }
			} as never)
		).rejects.toMatchObject({ status: 404 });
	});

	it('surfaces Sanity request failures', async () => {
		const loadQuery = vi.fn().mockRejectedValue(new Error('Sanity unavailable'));

		await expect(
			load({
				locals: { sanity: { loadQuery, previewEnabled: false } },
				params: { slug: 'new-about' }
			} as never)
		).rejects.toThrow('Sanity unavailable');
	});

	it('loads draft content with stega only in preview mode', async () => {
		const page = { _id: 'drafts.page-test', title: 'Draft page', sections: [] };
		const loadQuery = vi.fn().mockResolvedValue({ data: page });

		await load({
			locals: { sanity: { loadQuery, previewEnabled: true } },
			params: { slug: 'draft-page' }
		} as never);

		expect(loadQuery).toHaveBeenCalledWith(
			expect.any(String),
			{ slug: 'draft-page' },
			{ stega: true }
		);
	});
});

describe('Home and Contact CMS routes', () => {
	it.each([
		['Home', loadHome],
		['Contact', loadContact]
	])('%s returns 503 when its singleton content is missing', async (_name, loadPage) => {
		const loadQuery = vi.fn().mockResolvedValue({ data: null });

		await expect(
			loadPage({ locals: { sanity: { loadQuery, previewEnabled: false } } } as never)
		).rejects.toMatchObject({ status: 503 });
	});

	it.each([
		['Home', loadHome],
		['Contact', loadContact]
	])('%s surfaces Sanity request failures', async (_name, loadPage) => {
		const loadQuery = vi.fn().mockRejectedValue(new Error('Sanity unavailable'));

		await expect(
			loadPage({ locals: { sanity: { loadQuery, previewEnabled: false } } } as never)
		).rejects.toThrow('Sanity unavailable');
	});
});
