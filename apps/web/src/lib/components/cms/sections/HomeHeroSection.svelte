<script lang="ts">
	import type { HomePageQueryResult } from '$lib/sanity/sanity.types';
	import { stegaClean } from '@sanity/sveltekit';
	import HeadingContent from '$lib/components/cms/HeadingContent.svelte';
	import { foregroundColourClasses, sectionBackground } from '$lib/components/cms/section-colours';
	import { sanityImageUrl } from '$lib/sanity/images.js';

	type Section = Extract<
		NonNullable<NonNullable<HomePageQueryResult>['sections']>[number],
		{ _type: 'homeHeroSection' }
	>;
	let { section }: { section: Section } = $props();
	const imageUrl = $derived(sanityImageUrl(section.image?.asset, 1800));
	const foregroundColour = $derived(stegaClean(section.foregroundColour ?? 'primary'));
	const backgroundColour = $derived(
		sectionBackground(stegaClean(section.backgroundColour ?? 'background'))
	);
</script>

<section class="w-full" style:background-color={backgroundColour}>
	<div class="grid items-stretch lg:grid-cols-12">
		<div
			class="relative z-10 flex flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:col-span-5 lg:px-8"
		>
			<div class="relative z-10 lg:ml-[max(0px,calc((100vw_-_80rem)/2))]">
				<p
					class="text-sm font-semibold tracking-eyebrow uppercase whitespace-nowrap {foregroundColourClasses[
						foregroundColour
					] ?? 'text-primary'}"
				>
					{section.eyebrow}
				</p>
				<HeadingContent
					value={section.heading}
					level={1}
					{foregroundColour}
					className="mt-4 max-w-xl text-4xl font-bold text-balance sm:text-5xl lg:text-6xl"
				/>
				<p class="mt-5 max-w-xl text-base leading-7 text-foreground/80 sm:text-lg">
					{section.body}
				</p>
			</div>
		</div>

		<div class="relative min-h-70 lg:col-span-7 lg:min-h-130">
			<div
				class="absolute inset-y-0 left-0 z-10 hidden w-72 lg:block"
				style={`background: linear-gradient(to right, ${backgroundColour}, color-mix(in oklab, ${backgroundColour} 82%, transparent), transparent);`}
			></div>
			<div
				class="absolute inset-x-0 top-0 z-10 h-28 lg:hidden"
				style={`background: linear-gradient(to bottom, ${backgroundColour}, color-mix(in oklab, ${backgroundColour} 72%, transparent), transparent);`}
			></div>
			{#if imageUrl}
				<img
					src={imageUrl}
					alt={section.image?.alt ?? ''}
					class="h-full w-full object-cover object-[75%_center] lg:object-center"
				/>
			{/if}
		</div>
	</div>
</section>
