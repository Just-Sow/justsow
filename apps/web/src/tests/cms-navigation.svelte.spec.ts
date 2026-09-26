import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CmsNavigationLink from '../lib/components/cms/CmsNavigationLink.svelte';

describe('Sanity navigation links', () => {
	it('resolves an internal Static Page reference to its public path', async () => {
		await render(CmsNavigationLink, {
			props: {
				link: {
					label: 'About',
					destinationType: 'internal',
					pageSlug: 'about',
					internalPageType: 'page'
				}
			}
		});

		await expect
			.element(page.getByRole('link', { name: 'About' }))
			.toHaveAttribute('href', '/about');
	});

	it('opens configured external links safely in a new tab', async () => {
		await render(CmsNavigationLink, {
			props: {
				link: {
					label: 'External site',
					destinationType: 'external',
					externalUrl: 'https://example.org',
					openInNewTab: true
				}
			}
		});

		const link = page.getByRole('link', { name: 'External site' });
		await expect.element(link).toHaveAttribute('href', 'https://example.org');
		await expect.element(link).toHaveAttribute('target', '_blank');
		await expect.element(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('does not render links whose required destination is missing', async () => {
		await render(CmsNavigationLink, {
			props: {
				link: {
					label: 'Missing target',
					destinationType: 'internal',
					pageSlug: null,
					internalPageType: null
				}
			}
		});

		await expect
			.element(page.getByRole('link', { name: 'Missing target' }))
			.not.toBeInTheDocument();
	});
});
