<script lang="ts">
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { stegaClean } from '@sanity/sveltekit';
	import CmsLink from '$lib/components/cms/CmsLink.svelte';
	import PortableTextContent from '$lib/components/cms/PortableTextContent.svelte';
	import { sanityImageUrl } from '$lib/sanity/images.js';
	import HeadingContent from '$lib/components/cms/HeadingContent.svelte';
	import { foregroundColourClasses } from '$lib/components/cms/section-colours';
	import { callToActionVariant } from '$lib/components/cms/call-to-actions';

	type Section = Extract<
		NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number],
		{ _type: 'imageBackgroundSection' }
	>;
	let { section }: { section: Section } = $props();

	const backgroundUrl = $derived(sanityImageUrl(section.backgroundImage?.asset, 1800));
	const textAlignment = $derived(stegaClean(section.textAlignment ?? 'center'));
	const alignment = (value: string) =>
		value === 'left' ? 'text-left' : value === 'right' ? 'text-right' : 'text-center';
	const bodyAlignment = $derived(
		textAlignment === 'left' ? 'md:mr-auto' : textAlignment === 'right' ? 'md:ml-auto' : 'mx-auto'
	);
	const foregroundColour = $derived(stegaClean(section.foregroundColour ?? 'primary'));
	const callToActions = $derived(section.callToActions ?? []);
	const callToActionAlignment = $derived(
		`flex flex-wrap justify-center gap-3 ${
			textAlignment === 'right'
				? 'md:justify-end'
				: textAlignment === 'left'
					? 'md:justify-start'
					: ''
		}`
	);
</script>

<section
	class="relative isolate bg-slate-900 bg-cover bg-center py-20 text-white"
	style:background-image={backgroundUrl
		? `linear-gradient(#0009,#0009),url('${backgroundUrl}')`
		: undefined}
>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 {alignment(textAlignment)}">
		{#if section.eyebrow}
			<p
				class="mb-2 text-lg font-medium {alignment(textAlignment)} {foregroundColourClasses[
					foregroundColour
				] ?? 'text-primary'}"
			>
				{section.eyebrow}
			</p>
		{/if}
		<HeadingContent
			value={section.heading}
			{foregroundColour}
			className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
		/>
		{#if section.body}<PortableTextContent
				value={section.body}
				{foregroundColour}
				{textAlignment}
				className="{bodyAlignment} mb-8 max-w-2xl"
			/>{/if}
		{#if callToActions.length}
			<div class={callToActionAlignment}>
				{#each callToActions as callToAction, index (index)}
					<CmsLink
						link={callToAction}
						variant={callToActionVariant(callToAction.style, foregroundColour)}
						size="lg"
					/>
				{/each}
			</div>
		{/if}
	</div>
</section>
