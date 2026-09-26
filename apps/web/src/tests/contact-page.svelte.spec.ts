import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { readable } from 'svelte/store';

const fetchMock = vi.fn();
const sanityMocks = vi.hoisted(() => ({ useQuery: vi.fn() }));

vi.stubGlobal('fetch', fetchMock);
vi.mock('@sanity/sveltekit', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@sanity/sveltekit')>();
	return { ...actual, useQuery: sanityMocks.useQuery };
});

const contactPageContent = {
	seo: { title: 'Contact | JustSow', description: 'Get in touch with JustSow.' },
	sections: [
		{
			_key: 'contact-panel',
			_type: 'contactPanelSection',
			foregroundColour: 'primary',
			backgroundColour: 'white',
			heading: [
				{
					_type: 'block',
					_key: 'contact-heading',
					style: 'normal',
					markDefs: [],
					children: [
						{ _type: 'span', _key: 'contact-heading-span', text: 'Get in touch', marks: [] }
					]
				}
			],
			body: 'We would love to hear from you.',
			email: 'hello@example.org'
		}
	]
};

import Page from '../routes/contact/+page.svelte';

beforeEach(() => {
	fetchMock.mockReset();
	sanityMocks.useQuery.mockReturnValue(readable({ data: contactPageContent }));
});

describe('/contact/+page.svelte', () => {
	it('submits the contact form and shows success feedback', async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 201,
			json: async () => ({ status: true, submissionId: 'submission-test' })
		});

		await render(Page, { props: { data: {} as never } });

		await page.getByLabelText('Name').fill('Ada Lovelace');
		await page.getByLabelText('Email').fill('ada@example.com');
		await page
			.getByLabelText('Message')
			.fill('I would like to ask about the project application flow.');
		await page.getByRole('button', { name: 'Send Message' }).click();

		await expect.element(page.getByText('Thanks. Your message has been sent.')).toBeInTheDocument();
		await expect(fetchMock).toHaveBeenCalledWith(
			'/api/contact',
			expect.objectContaining({
				method: 'POST',
				credentials: 'include'
			})
		);
	});

	it('shows an error when the contact request fails', async () => {
		fetchMock.mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: async () => ({ message: 'Something went wrong.' })
		});

		await render(Page, { props: { data: {} as never } });

		await page.getByLabelText('Name').fill('Ada Lovelace');
		await page.getByLabelText('Email').fill('ada@example.com');
		await page
			.getByLabelText('Message')
			.fill('I would like to ask about the project application flow.');
		await page.getByRole('button', { name: 'Send Message' }).click();

		await expect.element(page.getByText('Something went wrong.')).toBeInTheDocument();
	});
});
