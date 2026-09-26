import { describe, expect, it } from 'vitest';
import { safePreviewRedirect } from './preview-redirect';

describe('safePreviewRedirect', () => {
	const origin = 'https://justsow.org';

	it('keeps safe same-origin paths, search params, and fragments', () => {
		expect(safePreviewRedirect('/contact?from=preview#form', origin)).toBe(
			'/contact?from=preview#form'
		);
	});

	it.each([
		'https://attacker.example',
		'//attacker.example',
		'/\\attacker.example',
		'javascript:alert(1)',
		'contact'
	])('falls back to home for unsafe redirect %s', (requestedRedirect) => {
		expect(safePreviewRedirect(requestedRedirect, origin)).toBe('/');
	});

	it('falls back to home when no redirect is supplied', () => {
		expect(safePreviewRedirect(null, origin)).toBe('/');
	});
});
