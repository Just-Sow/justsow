<script lang="ts">
	import { onMount } from 'svelte';
	import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
	import { stegaClean } from '@sanity/sveltekit';
	import CmsImage from '$lib/components/cms/CmsImage.svelte';
	import CmsLink from '$lib/components/cms/CmsLink.svelte';
	import PortableTextContent from '$lib/components/cms/PortableTextContent.svelte';
	import HeadingContent from '$lib/components/cms/HeadingContent.svelte';
	import { callToActionVariant } from '$lib/components/cms/call-to-actions';
	import { sectionBackground } from '$lib/components/cms/section-colours';

	type Section = Extract<
		NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number],
		{ _type: 'imageTextSection' }
	>;
	let { section }: { section: Section } = $props();
	let textColumn: HTMLDivElement;
	let imageFrame: HTMLDivElement;
	let imageHeight = $state(0);
	let imageWidth = $state(0);
	const imageTransformHeight = $derived(
		imageHeight && imageWidth
			? Math.max(1, Math.round((imageHeight * 1200) / imageWidth))
			: undefined
	);

	onMount(() => {
		const updateDimensions = () => {
			imageHeight = Math.ceil(textColumn.getBoundingClientRect().height);
			imageWidth = Math.round(imageFrame.getBoundingClientRect().width);
		};
		updateDimensions();

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === textColumn) {
					imageHeight = Math.ceil(entry.contentRect.height);
				} else {
					imageWidth = Math.max(1, Math.round(entry.contentRect.width));
				}
			}
		});

		observer.observe(textColumn);
		if (imageFrame) observer.observe(imageFrame);
		return () => observer.disconnect();
	});

	const alignment = (value: string | null | undefined) =>
		stegaClean(value ?? '') === 'left'
			? 'text-left'
			: stegaClean(value ?? '') === 'right'
				? 'text-right'
				: 'text-center';
	const imageFirst = $derived(stegaClean(section.imagePosition ?? '') === 'left');
	const foregroundColour = $derived(stegaClean(section.foregroundColour ?? 'primary'));
	const backgroundColour = $derived(
		sectionBackground(stegaClean(section.backgroundColour ?? 'background'))
	);
	const callToActions = $derived(section.callToActions ?? []);
	const callToActionAlignment = $derived(
		`flex flex-wrap justify-center gap-3 ${
			stegaClean(section.textAlignment ?? 'left') === 'right'
				? 'md:justify-end'
				: stegaClean(section.textAlignment ?? 'left') === 'left'
					? 'md:justify-start'
					: ''
		}`
	);
</script>

<section class="py-16" style:background-color={backgroundColour}>
	<div
		class="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-16 lg:px-8"
	>
		<div class={imageFirst ? 'md:order-2' : ''} bind:this={textColumn}>
			<div class={alignment(section.textAlignment)}>
				{#if section.eyebrow}
					<p
						class="mb-2 text-xl font-medium text-muted-foreground {alignment(
							section.textAlignment
						)}"
					>
						{section.eyebrow}
					</p>
				{/if}
				<HeadingContent
					value={section.heading}
					{foregroundColour}
					className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl"
				/>
				{#if section.body}<PortableTextContent
						value={section.body}
						{foregroundColour}
						textAlignment={stegaClean(section.textAlignment ?? 'left')}
						className="mb-6 text-lg"
					/>{/if}
				{#if callToActions.length}
					<div class={callToActionAlignment}>
						{#each callToActions as callToAction, index (index)}
							<CmsLink
								link={callToAction}
								variant={callToActionVariant(callToAction.style, foregroundColour)}
								size="lg"
							/>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<div class={imageFirst ? 'md:order-1' : ''}>
			<div
				class="relative w-full overflow-hidden rounded-2xl shadow-lg"
				style:height={imageHeight ? `${imageHeight}px` : undefined}
				bind:this={imageFrame}
			>
				<CmsImage
					image={section.image}
					width={1200}
					height={imageTransformHeight}
					class="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		</div>
	</div>
</section>
