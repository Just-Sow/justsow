<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		children: Snippet;
		footer?: Snippet;
	}

	let { title, description, children, footer }: Props = $props();
</script>

<section
	class="mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6"
>
	<Card.Root class="w-full max-w-md shadow-lg">
		<Card.Header class="gap-2 text-center">
			<Card.Title class="text-2xl">{title}</Card.Title>
			{#if description}
				<Card.Description>{description}</Card.Description>
			{/if}
		</Card.Header>
		<Card.Content>
			{@render children()}
		</Card.Content>
		{#if footer}
			<Card.Footer class="justify-center text-muted-foreground gap-1 text-sm">
				{@render footer()}
			</Card.Footer>
		{/if}
	</Card.Root>
</section>
