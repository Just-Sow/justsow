<script lang="ts">
	import * as LucideIcons from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { stegaClean } from '@sanity/sveltekit';
	import HeadingContent from '$lib/components/cms/HeadingContent.svelte';
	import { foregroundColourClasses, sectionBackground } from '$lib/components/cms/section-colours';

	type Section = Extract<
		NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number],
		{ _type: 'featuresSection' }
	>;
	let { section }: { section: Section } = $props();

	const featureIcons = LucideIcons as unknown as Record<string, Component>;
	const iconColors: Record<string, string> = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		accent: 'text-accent'
	};
	const getIconComponent = (value: string | null | undefined) => {
		const name = stegaClean(value ?? '')
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');
		return featureIcons[name];
	};
	const alignment = (value: string | null | undefined) =>
		stegaClean(value ?? '') === 'left'
			? 'text-left'
			: stegaClean(value ?? '') === 'right'
				? 'text-right'
				: 'text-center';
	const foregroundColour = $derived(stegaClean(section.foregroundColour ?? 'primary'));
	const backgroundColour = $derived(
		sectionBackground(stegaClean(section.backgroundColour ?? 'background'))
	);
</script>

<section class="py-16 sm:py-20" style:background-color={backgroundColour}>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#if section.eyebrow}
			<p
				class="mb-3 text-sm font-semibold tracking-eyebrow uppercase {foregroundColourClasses[
					foregroundColour
				] ?? 'text-primary'} {alignment(section.textAlignment)}"
			>
				{section.eyebrow}
			</p>
		{/if}
		<HeadingContent
			value={section.heading}
			{foregroundColour}
			className="{section.intro ? 'mb-4' : 'mb-12'} text-3xl font-bold sm:text-5xl {alignment(
				section.textAlignment
			)}"
		/>
		{#if section.intro}
			<p
				class="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground {alignment(
					section.textAlignment
				)}"
			>
				{section.intro}
			</p>
		{/if}
		<div class="flex flex-wrap justify-center gap-x-8 gap-y-10">
			{#each section.features ?? [] as feature (feature._key)}
				{@const FeatureIcon = getIconComponent(feature.icon) ?? LucideIcons.Sprout}
				{@const iconColor =
					iconColors[stegaClean(feature.iconColor ?? 'primary')] ?? 'text-primary'}
				<article
					class="min-w-0 basis-full grow text-center sm:basis-[calc(50%-1rem)] lg:basis-[calc(25%-1.5rem)]"
				>
					<FeatureIcon class="mx-auto mb-4 h-12 w-12 {iconColor}" aria-hidden="true" />
					<h3 class="mb-2 text-xl font-semibold">{feature.title}</h3>
					<p>{feature.description}</p>
				</article>
			{/each}
		</div>
	</div>
</section>
