<script lang="ts">
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { sanityImageUrl } from '$lib/sanity/images.js';

	type Section = NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number];
	type ImageWithAlt = Extract<Section, { _type: 'imageTextSection' }>['image'];

	let {
		image,
		width = 1200,
		class: className = ''
	}: { image: ImageWithAlt; width?: number; class?: string } = $props();

	const src = $derived(sanityImageUrl(image?.asset, width));
</script>

{#if src}
	<img {src} alt={image?.alt ?? ''} class={className} loading="lazy" />
{/if}
