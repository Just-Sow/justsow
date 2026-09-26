import { page as browserPage } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

const mocks = vi.hoisted(() => ({ page: { status: 404 } }));
vi.mock('$app/state', () => ({ page: mocks.page }));

import ErrorPage from '../routes/+error.svelte';

describe('route error page', () => {
	it('shows a helpful 404 with a way back to the homepage', async () => {
		await render(ErrorPage);

		await expect
			.element(browserPage.getByRole('heading', { name: 'Page not found' }))
			.toBeInTheDocument();
		await expect.element(browserPage.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
		await expect
			.element(browserPage.getByRole('link', { name: 'Go to homepage' }))
			.toHaveAttribute('href', '/');
	});

	it('uses browser history for the primary Go back action', async () => {
		const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});
		await render(ErrorPage);

		await browserPage.getByRole('button', { name: 'Go back' }).click();
		expect(back).toHaveBeenCalledOnce();
		back.mockRestore();
	});
});
