import { page as browserPage } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CmsPage from '../lib/components/cms/CmsPage.svelte';

const pageContent = {
	_id: 'page-about',
	_type: 'page',
	title: 'About JustSow',
	seo: { title: 'About | JustSow', description: 'Learn about JustSow.' },
	sections: [
		{
			_key: 'story',
			_type: 'imageTextSection',
			foregroundColour: 'primary',
			backgroundColour: 'white',
			eyebrow: 'Our story',
			heading: [
				{
					_type: 'block',
					_key: 'heading',
					style: 'normal',
					markDefs: [],
					children: [
						{ _type: 'span', _key: 'heading-span', text: 'Helping people give', marks: [] }
					]
				}
			],
			body: [
				{
					_type: 'block',
					_key: 'body',
					style: 'normal',
					markDefs: [],
					children: [
						{ _type: 'span', _key: 'body-span', text: 'A CMS-authored paragraph.', marks: [] }
					]
				}
			],
			imagePosition: 'right',
			textAlignment: 'left',
			image: null,
			callToActions: [
				{
					_key: 'learn-more',
					label: 'Learn more',
					style: 'primary',
					destinationType: 'external',
					externalUrl: 'https://example.org/about',
					openInNewTab: true,
					pageSlug: null,
					internalPageType: null
				},
				{
					_key: 'contact',
					label: 'Contact',
					style: 'secondary',
					destinationType: 'internal',
					externalUrl: null,
					openInNewTab: false,
					pageSlug: null,
					internalPageType: 'contactPage'
				}
			]
		}
	]
};

describe('CMS page rendering in the browser', () => {
	it('renders authored section content and safe external CTA attributes', async () => {
		await render(CmsPage, { props: { page: pageContent as never } });

		await expect
			.element(browserPage.getByRole('heading', { name: 'Helping people give' }))
			.toBeInTheDocument();
		await expect.element(browserPage.getByText('A CMS-authored paragraph.')).toBeInTheDocument();

		const link = browserPage.getByRole('link', { name: 'Learn more' });
		await expect.element(link).toHaveAttribute('href', 'https://example.org/about');
		await expect.element(link).toHaveAttribute('target', '_blank');
		await expect.element(link).toHaveAttribute('rel', 'noopener noreferrer');
		await expect
			.element(browserPage.getByRole('link', { name: 'Contact' }))
			.toHaveAttribute('href', '/contact');
	});
});
