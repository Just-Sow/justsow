<script lang="ts">
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { Button } from '$lib/components/ui/button';
	import { stegaClean } from '@sanity/sveltekit';

	type PageSection = NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number];
	type Link = NonNullable<Extract<PageSection, { _type: 'imageTextSection' }>['callToAction']>;

	let { link, class: className = '' }: { link: Link; class?: string } = $props();

	const href = $derived.by(() => {
		const destinationType = stegaClean(link.destinationType ?? '');
		if (destinationType === 'route') return stegaClean(link.route ?? '');
		if (destinationType === 'external') return stegaClean(link.externalUrl ?? '');
		const pageSlug = stegaClean(link.pageSlug ?? '');
		return pageSlug ? `/${pageSlug}` : undefined;
	});

	const isExternal = $derived(
		stegaClean(link.destinationType ?? '') === 'external' && link.openInNewTab
	);
</script>

{#if href}
	<Button
		{href}
		class={className}
		target={isExternal ? '_blank' : undefined}
		rel={isExternal ? 'noopener noreferrer' : undefined}
	>
		{link.label}
	</Button>
{/if}
