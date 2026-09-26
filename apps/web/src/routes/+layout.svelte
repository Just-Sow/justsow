<script lang="ts">
	import { PreviewMode, QueryLoader, VisualEditing } from '@sanity/sveltekit';
	import { page } from '$app/state';
	import { EyeOff } from '@lucide/svelte';
	import '../app.css';
	import favicon from '$lib/assets/branding/favicon.svg';
	import { createAuthStore, setAuthStore } from '$lib/auth/store.js';
	import { Button } from '$lib/components/ui/button';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { sanityClient } from '$lib/sanity/client.js';

	let { data, children } = $props();

	const auth = setAuthStore(createAuthStore(null));

	$effect(() => {
		auth.set(data.auth);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>JustSow</title>
</svelte:head>

<PreviewMode enabled={data.previewEnabled}>
	<VisualEditing enabled={data.previewEnabled}>
		<QueryLoader enabled={data.previewEnabled} client={sanityClient}>
			<div class="flex min-h-screen flex-col">
				<Header navigation={data.navigation} />

				<main class="flex-1">
					{@render children?.()}
				</main>

				<Footer navigation={data.navigation} />
			</div>

			{#if data.previewEnabled}
				<Button
					href={`/preview/disable?redirect=${encodeURIComponent(page.url.pathname + page.url.search)}`}
					variant="outline"
					size="lg"
					class="fixed right-4 bottom-4 z-[60]"
				>
					<EyeOff />
					Disable preview
				</Button>
			{/if}
		</QueryLoader>
	</VisualEditing>
</PreviewMode>
