<script lang="ts">
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { stegaClean } from '@sanity/sveltekit';
	import CmsImage from '$lib/components/cms/CmsImage.svelte';
	import CmsLink from '$lib/components/cms/CmsLink.svelte';
	import PortableTextContent from '$lib/components/cms/PortableTextContent.svelte';

	type Section = Extract<
		NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number],
		{ _type: 'imageTextSection' }
	>;
	let { section }: { section: Section } = $props();

	const alignment = (value: string | null | undefined) =>
		stegaClean(value ?? '') === 'left'
			? 'text-left'
			: stegaClean(value ?? '') === 'right'
				? 'text-right'
				: 'text-center';
	const imageFirst = $derived(stegaClean(section.imagePosition ?? '') === 'left');
</script>

<section class="bg-amber-50 py-16 sm:py-20">
	<div class="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
		<div class={imageFirst ? 'md:order-2' : ''}>
			<div class={alignment(section.textAlignment)}>
				<h2 class="mb-5 text-3xl font-bold sm:text-5xl">{section.heading}</h2>
				{#if section.body}<PortableTextContent value={section.body} />{/if}
				{#if section.callToAction}<CmsLink link={section.callToAction} class="mt-4" />{/if}
			</div>
		</div>
		<div class={imageFirst ? 'md:order-1' : ''}>
			<div class="min-h-72 overflow-hidden rounded-2xl">
				<CmsImage image={section.image} width={1200} class="h-full min-h-72 w-full object-cover" />
			</div>
		</div>
	</div>
</section>
