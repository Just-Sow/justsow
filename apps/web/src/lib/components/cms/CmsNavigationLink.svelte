<script lang="ts">
	import { resolve } from '$app/paths';
	import { stegaClean } from '@sanity/sveltekit';

	type Link = {
		label?: string | null;
		destinationType?: string | null;
		externalUrl?: string | null;
		pageSlug?: string | null;
		internalPageType?: string | null;
		openInNewTab?: boolean | null;
	};

	let {
		link,
		class: className = '',
		onclick
	}: {
		link: Link;
		class?: string;
		onclick?: () => void;
	} = $props();

	const href = $derived.by(() => {
		const type = stegaClean(link.destinationType ?? '');
		if (type === 'external') return stegaClean(link.externalUrl ?? '') || undefined;
		const pageType = stegaClean(link.internalPageType ?? '');
		if (pageType === 'homePage') return resolve('/');
		if (pageType === 'contactPage') return resolve('/contact');
		const slug = stegaClean(link.pageSlug ?? '');
		return slug ? resolve('/[slug]', { slug }) : undefined;
	});
	const external = $derived(stegaClean(link.destinationType ?? '') === 'external');
	const label = $derived(stegaClean(link.label ?? ''));
</script>

{#if href && label}
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		{href}
		class={className}
		target={external && link.openInNewTab ? '_blank' : undefined}
		rel={external && link.openInNewTab ? 'noopener noreferrer' : undefined}
		{onclick}
	>
		{label}
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
{/if}
