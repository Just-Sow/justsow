import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '../../routes/(auth)/signup/+page.svelte';

describe('/(auth)/signup/+page.svelte', () => {
	it('renders the claim-flow signup copy and fields', async () => {
		render(Page);

		await expect
			.element(page.getByRole('heading', { name: 'Create your account' }))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('claim an existing sower record with the same email'))
			.toBeInTheDocument();
		await expect.element(page.getByLabelText('First name')).toBeInTheDocument();
		await expect.element(page.getByLabelText('Last name')).toBeInTheDocument();
		await expect.element(page.getByLabelText('Email')).toBeInTheDocument();
		await expect.element(page.getByLabelText('Password')).toBeInTheDocument();
	});
});
