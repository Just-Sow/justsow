<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ContactPageQueryResult } from '$lib/sanity/sanity.types';
	import ContactPanelSection from './sections/ContactPanelSection.svelte';
	import FeaturesSection from './sections/FeaturesSection.svelte';
	import ImageBackgroundSection from './sections/ImageBackgroundSection.svelte';
	import ImageTextSection from './sections/ImageTextSection.svelte';

	let {
		sections,
		contactForm
	}: {
		sections: NonNullable<ContactPageQueryResult>['sections'];
		contactForm: Snippet;
	} = $props();
</script>

{#each sections ?? [] as section (section._key)}
	{#if section._type === 'contactPanelSection'}
		<ContactPanelSection {section} {contactForm} />
	{:else if section._type === 'imageBackgroundSection'}
		<ImageBackgroundSection {section} />
	{:else if section._type === 'imageTextSection'}
		<ImageTextSection {section} />
	{:else if section._type === 'featuresSection'}
		<FeaturesSection {section} />
	{/if}
{/each}
