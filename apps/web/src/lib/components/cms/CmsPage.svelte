<script lang="ts">
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { stegaClean } from '@sanity/sveltekit';
	import PageSections from './PageSections.svelte';

	let { page }: { page: NonNullable<CmsPageQueryResult> } = $props();
</script>

<svelte:head>
	<title>{stegaClean(page.seo?.title || page.title || '')} | JustSow</title>
	{#if page.seo?.description}<meta
			name="description"
			content={stegaClean(page.seo.description)}
		/>{/if}
</svelte:head>

<h1 class="sr-only">{page.title}</h1>
<PageSections sections={page.sections} />
