<script lang="ts">
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { stegaClean } from '@sanity/sveltekit';
	import CmsLink from '$lib/components/cms/CmsLink.svelte';
	import PortableTextContent from '$lib/components/cms/PortableTextContent.svelte';
	import { sanityImageUrl } from '$lib/sanity/images.js';

	type Section = Extract<
		NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number],
		{ _type: 'imageBackgroundSection' }
	>;
	let { section }: { section: Section } = $props();

	const backgroundUrl = $derived(sanityImageUrl(section.backgroundImage?.asset, 1800));
	const alignment = (value: string | null | undefined) =>
		stegaClean(value ?? '') === 'left'
			? 'text-left'
			: stegaClean(value ?? '') === 'right'
				? 'text-right'
				: 'text-center';
</script>

<section
	class="relative isolate bg-slate-900 bg-cover bg-center py-24 text-white"
	style:background-image={backgroundUrl
		? `linear-gradient(#0006,#0008),url('${backgroundUrl}')`
		: undefined}
>
	<div class="mx-auto max-w-5xl px-6 {alignment(section.textAlignment)}">
		<h2 class="mb-6 text-4xl font-bold sm:text-6xl">{section.heading}</h2>
		{#if section.body}<PortableTextContent value={section.body} />{/if}
		{#if section.callToAction}<CmsLink link={section.callToAction} class="mt-5" />{/if}
	</div>
</section>
