import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

const mocks = vi.hoisted(() => ({
	authRequest: vi.fn()
}));

vi.mock('$lib/auth/client.js', () => ({
	authRequest: mocks.authRequest,
	getAuthErrorMessage: (result: { error?: { message?: string } }, fallback: string) =>
		result.error?.message ?? fallback
}));

vi.mock('$app/paths', () => ({
	resolve: (path: string) => path
}));

import Page from '../../routes/(auth)/signup/+page.svelte';

beforeEach(() => {
	mocks.authRequest.mockReset();
});

describe('/(auth)/signup/+page.svelte', () => {
	it('submits the claim-flow signup payload and shows the success state', async () => {
		mocks.authRequest.mockResolvedValue({
			ok: true,
			status: 200,
			data: { user: { email: 'admin-testing@justsow.local' } },
			error: null
		});

		render(Page);

		await page.getByLabelText('First name').fill('Admin');
		await page.getByLabelText('Last name').fill('Testing');
		await page.getByLabelText('Email').fill('admin-testing@justsow.local');
		await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing!');
		await page.getByRole('textbox', { name: 'Confirm password', exact: true }).fill('testing!');
		await page.getByRole('button', { name: 'Create account' }).click();

		await expect
			.element(
				page.getByText(
					'Check your inbox for verification instructions. If this email matches an existing sower record, we will link that history to your new account.'
				)
			)
			.toBeInTheDocument();
		await expect(mocks.authRequest).toHaveBeenCalledWith('/api/auth/sign-up/email', {
			method: 'POST',
			body: JSON.stringify({
				name: 'Admin Testing',
				firstName: 'Admin',
				lastName: 'Testing',
				email: 'admin-testing@justsow.local',
				password: 'testing!',
				callbackURL: '/login'
			})
		});
	});

	it('shows the API error when signup fails', async () => {
		mocks.authRequest.mockResolvedValue({
			ok: false,
			status: 409,
			data: null,
			error: { message: 'That email address is already in use.' }
		});

		render(Page);

		await page.getByLabelText('First name').fill('Admin');
		await page.getByLabelText('Last name').fill('Testing');
		await page.getByLabelText('Email').fill('admin-testing@justsow.local');
		await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing!');
		await page.getByRole('textbox', { name: 'Confirm password', exact: true }).fill('testing!');
		await page.getByRole('button', { name: 'Create account' }).click();

		await expect
			.element(page.getByText('That email address is already in use.'))
			.toBeInTheDocument();
	});
});
