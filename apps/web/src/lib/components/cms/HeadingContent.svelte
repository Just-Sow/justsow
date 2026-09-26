<script lang="ts">
	import { PortableText, type InputValue, type PortableTextComponents } from '@portabletext/svelte';
	import HeadingInlineBlock from './HeadingInlineBlock.svelte';
	import SectionColourMark from './SectionColourMark.svelte';

	let {
		value,
		level = 2,
		foregroundColour = 'primary',
		className = ''
	}: {
		value: InputValue | null | undefined;
		level?: 1 | 2;
		foregroundColour?: string;
		className?: string;
	} = $props();
	const components = {
		block: {
			normal: HeadingInlineBlock,
			blockquote: undefined,
			h1: undefined,
			h2: undefined,
			h3: undefined,
			h4: undefined,
			h5: undefined,
			h6: undefined
		},
		marks: { foregroundColour: SectionColourMark }
	} satisfies PortableTextComponents;
	const hasValue = $derived(
		Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined
	);
</script>

{#if hasValue}
	<svelte:element this={level === 1 ? 'h1' : 'h2'} class={className}>
		<PortableText value={value ?? undefined} {components} context={{ foregroundColour }} />
	</svelte:element>
{/if}
