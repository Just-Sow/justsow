<script lang="ts">
	import { Droplets, Handshake, Lightbulb, Sprout, SunMedium, TreePine } from '@lucide/svelte';
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { stegaClean } from '@sanity/sveltekit';

	type Section = Extract<
		NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number],
		{ _type: 'featuresSection' }
	>;
	let { section }: { section: Section } = $props();

	const featureIcons = {
		sprout: Sprout,
		water: Droplets,
		sun: SunMedium,
		idea: Lightbulb,
		partnership: Handshake,
		tree: TreePine
	};
	const alignment = (value: string | null | undefined) =>
		stegaClean(value ?? '') === 'left'
			? 'text-left'
			: stegaClean(value ?? '') === 'right'
				? 'text-right'
				: 'text-center';
</script>

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-3xl font-bold sm:text-5xl {alignment(section.textAlignment)}">
			{section.heading}
		</h2>
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each section.features ?? [] as feature (feature._key)}
				{@const FeatureIcon =
					featureIcons[stegaClean(feature.icon ?? '') as keyof typeof featureIcons] ?? Sprout}
				<article class="text-center">
					<FeatureIcon class="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
					<h3 class="mb-2 text-xl font-semibold">{feature.title}</h3>
					<p>{feature.description}</p>
				</article>
			{/each}
		</div>
	</div>
</section>
