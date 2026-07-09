import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

const mocks = vi.hoisted(() => ({
	authRequest: vi.fn(),
	goto: vi.fn(),
	invalidateAll: vi.fn()
}));

vi.mock('$lib/auth/client.js', () => ({
	authRequest: mocks.authRequest,
	getAuthErrorMessage: (
		result: { error?: { message?: string }; status: number },
		fallback: string
	) => result.error?.message ?? fallback
}));

vi.mock('$app/navigation', () => ({
	goto: mocks.goto,
	invalidateAll: mocks.invalidateAll
}));

vi.mock('$app/paths', () => ({
	resolve: (path: string) => path
}));

import Page from '../../routes/(auth)/login/+page.svelte';

beforeEach(() => {
	mocks.authRequest.mockReset();
	mocks.goto.mockReset();
	mocks.invalidateAll.mockReset();
});

describe('/(auth)/login/+page.svelte', () => {
	it('shows the resend verification action when the API says the account is unverified', async () => {
		mocks.authRequest.mockResolvedValueOnce({
			ok: false,
			status: 403,
			data: null,
			error: { message: 'Email verification is required before signing in.' }
		});
		mocks.authRequest.mockResolvedValueOnce({
			ok: true,
			status: 200,
			data: { status: true },
			error: null
		});

		render(Page);

		await page.getByLabelText('Email').fill('admin-testing@justsow.local');
		await page.getByLabelText('Password').fill('testing!');
		await page.getByRole('button', { name: 'Sign in' }).click();

		await expect
			.element(page.getByText('Email verification is required before signing in.'))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: 'Resend verification email' }))
			.toBeInTheDocument();

		await page.getByRole('button', { name: 'Resend verification email' }).click();

		await expect
			.element(
				page.getByText(
					'If that account exists and still needs verification, a new verification email has been sent.'
				)
			)
			.toBeInTheDocument();
		await expect(mocks.authRequest).toHaveBeenNthCalledWith(1, '/api/auth/sign-in/email', {
			method: 'POST',
			body: JSON.stringify({
				email: 'admin-testing@justsow.local',
				password: 'testing!',
				callbackURL: '/'
			})
		});
		await expect(mocks.authRequest).toHaveBeenNthCalledWith(
			2,
			'/api/auth/send-verification-email',
			{
				method: 'POST',
				body: JSON.stringify({
					email: 'admin-testing@justsow.local',
					callbackURL: '/login'
				})
			}
		);
	});

	it('routes to the two-factor challenge when the API requires it', async () => {
		mocks.authRequest.mockResolvedValue({
			ok: true,
			status: 200,
			data: { twoFactorRedirect: true },
			error: null
		});

		render(Page);

		await page.getByLabelText('Email').fill('admin-testing@justsow.local');
		await page.getByLabelText('Password').fill('testing!');
		await page.getByRole('button', { name: 'Sign in' }).click();

		await expect(mocks.goto).toHaveBeenCalledWith('/two-factor');
		await expect(mocks.invalidateAll).not.toHaveBeenCalled();
	});
});
