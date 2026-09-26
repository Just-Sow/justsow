<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HomePageQueryResult } from '$lib/sanity/sanity.types';
	import FeaturesSection from './sections/FeaturesSection.svelte';
	import HomeHeroSection from './sections/HomeHeroSection.svelte';
	import ImageBackgroundSection from './sections/ImageBackgroundSection.svelte';
	import ImageTextSection from './sections/ImageTextSection.svelte';

	let {
		sections,
		projectDiscovery
	}: {
		sections: NonNullable<HomePageQueryResult>['sections'];
		projectDiscovery: Snippet<
			[
				Extract<
					NonNullable<NonNullable<HomePageQueryResult>['sections']>[number],
					{ _type: 'projectDiscoveryModule' }
				>
			]
		>;
	} = $props();
</script>

{#each sections ?? [] as section (section._key)}
	{#if section._type === 'homeHeroSection'}
		<HomeHeroSection {section} />
	{:else if section._type === 'projectDiscoveryModule'}
		{@render projectDiscovery(section)}
	{:else if section._type === 'imageBackgroundSection'}
		<ImageBackgroundSection {section} />
	{:else if section._type === 'imageTextSection'}
		<ImageTextSection {section} />
	{:else if section._type === 'featuresSection'}
		<FeaturesSection {section} />
	{/if}
{/each}
