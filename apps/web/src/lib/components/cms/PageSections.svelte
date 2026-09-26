<script lang="ts">
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import FeaturesSection from './sections/FeaturesSection.svelte';
	import ImageBackgroundSection from './sections/ImageBackgroundSection.svelte';
	import ImageTextSection from './sections/ImageTextSection.svelte';

	let { sections }: { sections: NonNullable<CmsPageQueryResult>['sections'] } = $props();
</script>

{#each sections ?? [] as section (section._key)}
	{#if section._type === 'imageBackgroundSection'}
		<ImageBackgroundSection {section} />
	{:else if section._type === 'imageTextSection'}
		<ImageTextSection {section} />
	{:else if section._type === 'featuresSection'}
		<FeaturesSection {section} />
	{/if}
{/each}
