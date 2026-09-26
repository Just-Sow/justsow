<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { BlockComponentProps } from '@portabletext/svelte';
	import { foregroundBorderClasses } from './section-colours';

	let { portableText, children }: { portableText: BlockComponentProps; children?: Snippet } =
		$props();
	const context = $derived(
		portableText.global.context as { foregroundColour?: string; textAlignment?: string }
	);
	const colour = $derived(
		foregroundBorderClasses[context.foregroundColour ?? 'primary'] ?? 'border-primary'
	);
	const alignment = $derived(context.textAlignment ?? 'left');
</script>

<blockquote
	class={`my-6 py-1 text-lg italic ${colour} ${
		alignment === 'right'
			? 'border-r-4 pr-5 text-right'
			: alignment === 'center'
				? 'text-center'
				: 'border-l-4 pl-5 text-left'
	}`}
>
	{@render children?.()}
</blockquote>
