<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	let {
		eyebrow,
		title,
		description,
		centered = false,
		children
	}: {
		eyebrow?: string;
		title: string;
		description?: string;
		centered?: boolean;
		children?: import('svelte').Snippet;
	} = $props();
</script>

{#if centered}
	<section class="mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
		<Card.Root class="w-full max-w-md border-border/70 bg-background/95 py-0 shadow-lg">
			{@render children?.()}
		</Card.Root>
	</section>
{:else}
	<section class="mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-6xl items-center px-4 py-12 sm:px-6">
		<div class="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
			<div class="space-y-6">
				{#if eyebrow}
					<p class="text-sm font-semibold tracking-[0.22em] text-primary uppercase">{eyebrow}</p>
				{/if}
				<div class="space-y-4">
					<h1 class="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
					{#if description}
						<p class="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
					{/if}
				</div>
			</div>

			<Card.Root class="border-border/70 bg-background/95 py-0 shadow-lg">
				{@render children?.()}
			</Card.Root>
		</div>
	</section>
{/if}
