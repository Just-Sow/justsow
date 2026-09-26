<script lang="ts">
	import { useQuery } from '@sanity/sveltekit';
	import CmsPage from '$lib/components/cms/CmsPage.svelte';
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const query = $derived(useQuery<CmsPageQueryResult>(data));
	const page = $derived($query.data);
</script>

{#if page}
	<CmsPage {page} />
{/if}
