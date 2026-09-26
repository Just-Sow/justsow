<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MarkComponentProps } from '@portabletext/svelte';
	import { foregroundColourClasses } from './section-colours';

	let { portableText, children }: { portableText: MarkComponentProps; children?: Snippet } =
		$props();
	const colour = $derived(
		(portableText.global.context as { foregroundColour?: string }).foregroundColour ?? 'primary'
	);
</script>

<span class={foregroundColourClasses[colour] ?? foregroundColourClasses.primary}
	>{@render children?.()}</span
>
