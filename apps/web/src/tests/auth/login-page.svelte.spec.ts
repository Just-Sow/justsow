import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '../../routes/(auth)/login/+page.svelte';

describe('/(auth)/login/+page.svelte', () => {
	it('renders the sign-in form and recovery link', async () => {
		render(Page);

		await expect.element(page.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
		await expect.element(page.getByText('Login to your account.')).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Forgot password?' })).toBeInTheDocument();
	});
});
