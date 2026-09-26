<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';

	const isNotFound = $derived(page.status === 404);
	const message = $derived(
		page.status >= 500
			? "We couldn't load this page right now. Please try again shortly."
			: isNotFound
				? "The page you're looking for isn't available."
				: "We couldn't open this page."
	);
</script>

<svelte:head>
	<title>{isNotFound ? 'Page not found' : 'Page unavailable'} | JustSow</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center"
>
	<p class="mb-3 text-2xl font-bold tracking-eyebrow text-primary uppercase sm:text-3xl">
		{isNotFound ? '404' : `Error ${page.status}`}
	</p>
	<h1 class="mb-4 text-4xl font-bold sm:text-5xl">
		{isNotFound ? 'Page not found' : 'Page unavailable'}
	</h1>
	<p class="mb-8 max-w-xl text-lg text-muted-foreground">{message}</p>
	<div class="flex flex-wrap justify-center gap-3">
		<Button size="lg" onclick={() => window.history.back()}>Go back</Button>
		<Button href="/" size="lg" variant="outline">Go to homepage</Button>
	</div>
</section>
