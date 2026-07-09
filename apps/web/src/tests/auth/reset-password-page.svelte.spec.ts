import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

const mocks = vi.hoisted(() => ({
	authRequest: vi.fn(),
	goto: vi.fn(),
	pageState: {
		params: {
			token: 'reset-token'
		}
	}
}));

vi.mock('$lib/auth/client.js', () => ({
	authRequest: mocks.authRequest,
	getAuthErrorMessage: (result: { error?: { message?: string } }, fallback: string) =>
		result.error?.message ?? fallback
}));

vi.mock('$app/navigation', () => ({
	goto: mocks.goto
}));

vi.mock('$app/paths', () => ({
	resolve: (path: string) => path
}));

vi.mock('$app/state', () => ({
	page: mocks.pageState
}));

import Page from '../../routes/(auth)/reset-password/[token]/+page.svelte';

beforeEach(() => {
	mocks.authRequest.mockReset();
	mocks.goto.mockReset();
	mocks.pageState.params.token = 'reset-token';
});

describe('/(auth)/reset-password/[token]/+page.svelte', () => {
	it('submits the reset password payload and navigates back to login', async () => {
		mocks.authRequest.mockResolvedValue({
			ok: true,
			status: 200,
			data: { status: true },
			error: null
		});

		render(Page);

		await page.getByLabelText('New password').fill('testing!');
		await page.getByLabelText('Confirm password').fill('testing!');
		await page.getByRole('button', { name: 'Save new password' }).click();

		await expect(mocks.authRequest).toHaveBeenCalledWith(
			'/api/auth/reset-password?token=reset-token',
			{
				method: 'POST',
				body: JSON.stringify({
					newPassword: 'testing!'
				})
			}
		);
		await expect(mocks.goto).toHaveBeenCalledWith('/login');
	});

	it('shows an API error when the reset token is rejected', async () => {
		mocks.authRequest.mockResolvedValue({
			ok: false,
			status: 400,
			data: null,
			error: { message: 'That reset link is no longer valid.' }
		});

		render(Page);

		await page.getByLabelText('New password').fill('testing!');
		await page.getByLabelText('Confirm password').fill('testing!');
		await page.getByRole('button', { name: 'Save new password' }).click();

		await expect.element(page.getByText('That reset link is no longer valid.')).toBeInTheDocument();
		await expect(mocks.goto).not.toHaveBeenCalled();
	});
});
