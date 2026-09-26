import { readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_OWNED_PAGE_SLUGS, getAppOwnedPageSlugReason } from '@justsow/shared';
import { describe, expect, it } from 'vitest';

const routesDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../../routes');

function walk(directory: string): string[] {
	return readdirSync(directory).flatMap((name) => {
		const path = join(directory, name);
		if (statSync(path).isDirectory()) return walk(path);
		return name === '+page.svelte' ? [path] : [];
	});
}

function getStaticSingleSegmentPageSlugs(): string[] {
	return walk(routesDirectory)
		.map((pagePath) =>
			relative(routesDirectory, dirname(pagePath))
				.split(sep)
				.filter((segment) => segment && segment !== '.' && !/^\(.+\)$/.test(segment))
		)
		.filter((segments) => segments.length === 1 && !segments[0].startsWith('['))
		.map(([slug]) => slug);
}

describe('CMS page slug reservations', () => {
	it('reserves every static single-segment SvelteKit page route', () => {
		const missingReservations = getStaticSingleSegmentPageSlugs().filter(
			(slug) => !Object.hasOwn(APP_OWNED_PAGE_SLUGS, slug)
		);

		expect(missingReservations).toEqual([]);
	});

	it('allows the migrated About slug and reserves app-owned routes', () => {
		expect(getAppOwnedPageSlugReason('about')).toBeUndefined();
		expect(getAppOwnedPageSlugReason('contact')).toContain('Contact page');
		expect(getAppOwnedPageSlugReason('new-about')).toBeUndefined();
	});
});
