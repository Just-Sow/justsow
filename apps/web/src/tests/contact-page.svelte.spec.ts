import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

const fetchMock = vi.fn();

vi.stubGlobal('fetch', fetchMock);

import Page from '../routes/contact/+page.svelte';

beforeEach(() => {
	fetchMock.mockReset();
});

describe('/contact/+page.svelte', () => {
	it('submits the contact form and shows success feedback', async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 201,
			json: async () => ({ status: true, submissionId: 'submission-test' })
		});

		render(Page);

		await page.getByLabelText('Name').fill('Ada Lovelace');
		await page.getByLabelText('Email').fill('ada@example.com');
		await page.getByLabelText('Message').fill('I would like to ask about the project application flow.');
		await page.getByRole('button', { name: 'Send message' }).click();

		await expect
			.element(
				page.getByText('Thanks. Your message has been sent.')
			)
			.toBeInTheDocument();
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

		render(Page);

		await page.getByLabelText('Name').fill('Ada Lovelace');
		await page.getByLabelText('Email').fill('ada@example.com');
		await page.getByLabelText('Message').fill('I would like to ask about the project application flow.');
		await page.getByRole('button', { name: 'Send message' }).click();

		await expect.element(page.getByText('Something went wrong.')).toBeInTheDocument();
	});
});
