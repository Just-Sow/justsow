<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';

	type Section = NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number];
	type Body = Extract<Section, { _type: 'imageTextSection' }>['body'];
	let { value }: { value: Body } = $props();
</script>

{#if value?.length}
	<div class="cms-rich-text">
		<PortableText {value} />
	</div>
{/if}
