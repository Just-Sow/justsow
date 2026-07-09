import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '../../routes/(auth)/two-factor/+page.svelte';

describe('/(auth)/two-factor/+page.svelte', () => {
	it('renders the backup-code fallback and trust-device option', async () => {
		render(Page);

		await expect
			.element(page.getByRole('heading', { name: 'Two-factor verification' }))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Use the 6-digit code currently shown in your authenticator app.'))
			.toBeInTheDocument();

		await page.getByRole('button', { name: 'Use a backup code instead' }).click();

		await expect
			.element(page.getByText('Backup codes are single-use reserve codes.'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Trust this device for future sign-ins'))
			.toBeInTheDocument();
	});
});
