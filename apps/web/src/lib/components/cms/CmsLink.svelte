<script lang="ts">
	import { Button, type ButtonSize, type ButtonVariant } from '$lib/components/ui/button';
	import { stegaClean } from '@sanity/sveltekit';
	import type { SectionCallToAction } from './call-to-actions';

	let {
		link,
		class: className = '',
		variant = 'default',
		size = 'default'
	}: {
		link: SectionCallToAction;
		class?: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
	} = $props();

	const href = $derived.by(() => {
		const destinationType = stegaClean(String(link.destinationType ?? ''));
		if (destinationType === 'external') return stegaClean(link.externalUrl ?? '');
		const internalPageType = stegaClean(link.internalPageType ?? '');
		if (internalPageType === 'homePage') return '/';
		if (internalPageType === 'contactPage') return '/contact';
		const pageSlug = stegaClean(link.pageSlug ?? '');
		return pageSlug ? `/${pageSlug}` : undefined;
	});

	const isExternal = $derived(
		stegaClean(link.destinationType ?? '') === 'external' && link.openInNewTab
	);
</script>

{#if href && stegaClean(link.label ?? '').trim()}
	<Button
		{href}
		class={className}
		{variant}
		{size}
		target={isExternal ? '_blank' : undefined}
		rel={isExternal ? 'noopener noreferrer' : undefined}
	>
		{link.label}
	</Button>
{/if}
