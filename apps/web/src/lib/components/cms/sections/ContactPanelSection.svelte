<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Mail } from '@lucide/svelte';
	import { stegaClean } from '@sanity/sveltekit';
	import SiFacebook from '~icons/simple-icons/facebook';
	import SiInstagram from '~icons/simple-icons/instagram';
	import SiX from '~icons/simple-icons/x';
	import type { ContactPageQueryResult } from '$lib/sanity/sanity.types';
	import HeadingContent from '$lib/components/cms/HeadingContent.svelte';
	import { sectionBackground } from '$lib/components/cms/section-colours';

	type Section = Extract<
		NonNullable<NonNullable<ContactPageQueryResult>['sections']>[number],
		{ _type: 'contactPanelSection' }
	>;
	let { section, contactForm }: { section: Section; contactForm: Snippet } = $props();

	const email = $derived(stegaClean(section.email ?? ''));
	const foregroundColour = $derived(stegaClean(section.foregroundColour ?? 'primary'));
	const backgroundColour = $derived(
		sectionBackground(stegaClean(section.backgroundColour ?? 'background'))
	);
</script>

<section class="py-20" style:background-color={backgroundColour}>
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8"
	>
		<div>
			<HeadingContent
				value={section.heading}
				level={1}
				{foregroundColour}
				className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl"
			/>
			<p class="mb-6 text-lg">{section.body}</p>

			<div class="space-y-4 text-lg">
				<div class="flex items-center space-x-3">
					<Mail class="h-6 w-6 text-primary" />
					<a href={`mailto:${email}`} class="inline-flex w-fit hover:text-primary">
						{section.email}
					</a>
				</div>

				<div class="space-y-3">
					<p class="text-sm font-semibold uppercase tracking-eyebrow text-muted-foreground">
						Connect on socials
					</p>
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<ul class="space-y-3">
						<li class="w-fit">
							<a
								href="https://www.instagram.com/officialjustsow/"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex w-fit items-center space-x-3 text-base transition-colors hover:text-primary"
							>
								<SiInstagram class="h-5 w-5 text-primary" aria-hidden="true" />
								<span>@officialjustsow</span>
							</a>
						</li>
						<li class="w-fit">
							<a
								href="https://www.facebook.com/JustSowGiving/"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex w-fit items-center space-x-3 text-base transition-colors hover:text-primary"
							>
								<SiFacebook class="h-5 w-5 text-primary" aria-hidden="true" />
								<span>/JustSowGiving</span>
							</a>
						</li>
						<li class="w-fit">
							<a
								href="https://x.com/just_sow"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex w-fit items-center space-x-3 text-base transition-colors hover:text-primary"
							>
								<SiX class="h-5 w-5 text-primary" aria-hidden="true" />
								<span>@just_sow</span>
							</a>
						</li>
					</ul>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</div>
			</div>
		</div>

		<div>{@render contactForm()}</div>
	</div>
</section>
