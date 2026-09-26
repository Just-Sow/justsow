<script lang="ts">
	import { PortableText, type InputValue } from '@portabletext/svelte';
	import QuoteBlock from './QuoteBlock.svelte';
	import SectionColourMark from './SectionColourMark.svelte';

	let {
		value,
		foregroundColour = 'primary',
		textAlignment = 'left',
		className = ''
	}: {
		value: InputValue | null | undefined;
		foregroundColour?: string;
		textAlignment?: string;
		className?: string;
	} = $props();
	const components = {
		block: {
			normal: undefined,
			blockquote: QuoteBlock,
			h1: undefined,
			h2: undefined,
			h3: undefined,
			h4: undefined,
			h5: undefined,
			h6: undefined
		},
		marks: { foregroundColour: SectionColourMark }
	} satisfies import('@portabletext/svelte').PortableTextComponents;
	const hasValue = $derived(
		Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined
	);
</script>

{#if hasValue}
	<div class="cms-rich-text space-y-4 {className}">
		<PortableText
			value={value ?? undefined}
			{components}
			context={{ foregroundColour, textAlignment }}
		/>
	</div>
{/if}
