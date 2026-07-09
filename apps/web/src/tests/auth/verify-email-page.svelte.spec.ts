import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

const mocks = vi.hoisted(() => ({
	authRequest: vi.fn(),
	mockPage: {
		url: new URL('http://localhost/verify-email')
	}
}));

vi.mock('$lib/auth/client.js', () => ({
	authRequest: mocks.authRequest
}));

vi.mock('$app/state', () => ({
	page: mocks.mockPage
}));

vi.mock('$app/paths', () => ({
	resolve: (path: string) => path
}));

import Page from '../../routes/(auth)/verify-email/+page.svelte';

beforeEach(() => {
	mocks.authRequest.mockReset();
	mocks.mockPage.url = new URL('http://localhost/verify-email');
});

describe('/(auth)/verify-email/+page.svelte', () => {
	it('shows an error when the verification token is missing', async () => {
		render(Page);

		await expect
			.element(page.getByText('That verification link is missing its token.'))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('link', { name: 'Back to login' }))
			.toHaveAttribute('href', '/login');
	});

	it('shows a verification success state for the default login callback', async () => {
		mocks.mockPage.url = new URL('http://localhost/verify-email?token=token-test');
		mocks.authRequest.mockResolvedValue({
			ok: true,
			status: 200,
			data: { status: true },
			error: null
		});

		render(Page);

		await expect
			.element(page.getByText('Your email has been verified. You can now sign in.'))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('link', { name: 'Continue to login' }))
			.toHaveAttribute('href', '/login');
		await expect(mocks.authRequest).toHaveBeenCalledWith(
			'/api/auth/verify-email?token=token-test&callbackURL=%2Flogin',
			{ method: 'GET' }
		);
	});

	it('shows the custom callback state after verification', async () => {
		mocks.mockPage.url = new URL(
			'http://localhost/verify-email?token=token-test&callbackURL=%2Faccount%2Fsettings'
		);
		mocks.authRequest.mockResolvedValue({
			ok: true,
			status: 200,
			data: { status: true },
			error: null
		});

		render(Page);

		await expect.element(page.getByText('Your email has been verified.')).toBeInTheDocument();
		await expect
			.element(page.getByRole('link', { name: 'Continue' }))
			.toHaveAttribute('href', '/account/settings');
		await expect(mocks.authRequest).toHaveBeenCalledWith(
			'/api/auth/verify-email?token=token-test&callbackURL=%2Faccount%2Fsettings',
			{ method: 'GET' }
		);
	});

	it('shows the API error message when verification fails', async () => {
		mocks.mockPage.url = new URL('http://localhost/verify-email?token=token-test');
		mocks.authRequest.mockResolvedValue({
			ok: false,
			status: 400,
			data: null,
			error: { message: 'That link has expired.' }
		});

		render(Page);

		await expect.element(page.getByText('That link has expired.')).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Back to login' })).toBeInTheDocument();
	});
});
