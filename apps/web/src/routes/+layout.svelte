<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { createAuthStore, setAuthStore } from '$lib/auth/store.js';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

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

<div class="flex min-h-screen flex-col">
	<Header />

	<main class="flex-1">
		{@render children?.()}
	</main>

	<Footer />
</div>
