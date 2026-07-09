import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { AuthViewer } from '$lib/auth/session.js';
import AccountSettingsHarness from '$lib/test-support/AccountSettingsHarness.svelte';

const buildAuthViewer = (overrides: Partial<AuthViewer> = {}): AuthViewer =>
	({
		session: {
			id: 'session-test',
			expiresAt: '2026-07-09T00:00:00.000Z',
			token: 'session-token',
			createdAt: '2026-07-09T00:00:00.000Z',
			updatedAt: '2026-07-09T00:00:00.000Z',
			ipAddress: null,
			userAgent: null,
			userId: 'user-test'
		},
		user: {
			id: 'user-test',
			email: 'admin-testing@justsow.local',
			name: 'Admin Testing',
			emailVerified: true,
			twoFactorEnabled: false,
			image: null,
			createdAt: '2026-07-09T00:00:00.000Z',
			updatedAt: '2026-07-09T00:00:00.000Z',
			firstName: 'Admin',
			lastName: 'Testing',
			phoneNumber: null,
			twoFactorEnabledAt: null,
			passwordChangedAt: null
		},
		roles: ['admin'],
		security: {
			twoFactor: {
				enabled: false,
				enabledAt: null,
				required: true,
				requiredForRoles: ['admin'],
				satisfied: false
			}
		},
		sowerProfile: null,
		...overrides
	}) satisfies AuthViewer;

describe('/account/settings/+page.svelte', () => {
	it('shows created-password and disabled-2fa status by default', async () => {
		render(AccountSettingsHarness, {
			auth: buildAuthViewer(),
			data: {
				security: {
					twoFactor: {
						enabled: false,
						enabledAt: null
					}
				}
			}
		});

		await expect.element(page.getByText('Password created')).toBeInTheDocument();
		await expect.element(page.getByText('Not enabled')).toBeInTheDocument();
		await expect.element(page.getByText('Add a phone number')).toBeInTheDocument();
	});

	it('shows changed-password and enabled-2fa status when present', async () => {
		render(AccountSettingsHarness, {
			auth: buildAuthViewer({
				user: {
					id: 'user-test',
					email: 'admin-testing@justsow.local',
					name: 'Admin Testing',
					emailVerified: true,
					twoFactorEnabled: true,
					image: null,
					createdAt: '2026-07-09T00:00:00.000Z',
					updatedAt: '2026-07-09T00:00:00.000Z',
					firstName: 'Admin',
					lastName: 'Testing',
					phoneNumber: '+61400123456',
					twoFactorEnabledAt: '2026-07-09T00:00:00.000Z',
					passwordChangedAt: '2026-07-09T01:00:00.000Z'
				},
				security: {
					twoFactor: {
						enabled: true,
						enabledAt: '2026-07-09T00:00:00.000Z',
						required: true,
						requiredForRoles: ['admin'],
						satisfied: true
					}
				}
			}),
			data: {
				security: {
					twoFactor: {
						enabled: true,
						enabledAt: '2026-07-09T00:00:00.000Z'
					}
				}
			}
		});

		await expect.element(page.getByText('Password changed')).toBeInTheDocument();
		await expect.element(page.getByText('Enabled')).toBeInTheDocument();
	});
});
