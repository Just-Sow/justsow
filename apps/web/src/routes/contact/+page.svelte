<script lang="ts">
	import { useQuery } from '@sanity/sveltekit';
	import { stegaClean } from '@sanity/sveltekit';
	import type { ContactPageQueryResult } from '$lib/sanity/sanity.types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Send } from '@lucide/svelte';
	import ContactPageSections from '$lib/components/cms/ContactPageSections.svelte';
	import { sanityImageUrl } from '$lib/sanity/images.js';

	let { data } = $props();
	const query = $derived(useQuery<ContactPageQueryResult>(data));
	const page = $derived($query.data);
	const seoImage = $derived(sanityImageUrl(page?.seo?.socialImage?.asset, 1200));

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let website = $state('');
	let isSubmitting = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');
	let fieldErrors = $state({
		name: '',
		email: '',
		message: ''
	});
	let touched = $state({
		name: false,
		email: false,
		message: false
	});

	const validateField = (field: keyof typeof fieldErrors) => {
		switch (field) {
			case 'name':
				fieldErrors.name = name.trim().length >= 2 ? '' : 'Enter your name.';
				return !fieldErrors.name;
			case 'email':
				fieldErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
					? ''
					: 'Enter a valid email address.';
				return !fieldErrors.email;
			case 'message':
				fieldErrors.message =
					message.trim().length >= 20 ? '' : 'Tell us a little more so we can respond properly.';
				return !fieldErrors.message;
		}
	};

	const touchField = (field: keyof typeof touched) => {
		touched[field] = true;
		validateField(field);
	};

	const handleFieldInput = (field: keyof typeof touched) => {
		if (touched[field]) validateField(field);
	};

	const validateForm = () => {
		touched.name = true;
		touched.email = true;
		touched.message = true;
		return validateField('name') && validateField('email') && validateField('message');
	};

	const resetForm = () => {
		name = '';
		email = '';
		message = '';
		website = '';
		fieldErrors = { name: '', email: '', message: '' };
		touched = { name: false, email: false, message: false };
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		successMessage = '';
		errorMessage = '';
		if (!validateForm()) return;

		isSubmitting = true;
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				credentials: 'include',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					message: message.trim(),
					website: website.trim()
				})
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as { message?: string } | null;
				errorMessage = payload?.message ?? 'We could not send your message right now.';
				return;
			}

			successMessage = 'Thanks. Your message has been sent.';
			resetForm();
		} catch {
			errorMessage = 'We could not send your message right now.';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<svelte:head>
	<title>{stegaClean(page?.seo?.title ?? 'Contact | JustSow')}</title>
	{#if page?.seo?.description}
		<meta name="description" content={stegaClean(page.seo.description)} />
		<meta property="og:description" content={stegaClean(page.seo.description)} />
	{/if}
	<meta property="og:title" content={stegaClean(page?.seo?.title ?? 'Contact | JustSow')} />
	{#if seoImage}<meta property="og:image" content={seoImage} />{/if}
</svelte:head>

{#snippet contactForm()}
	<Card.Root class="rounded-2xl bg-white p-8 shadow-lg">
		<h2 class="mb-6 text-2xl font-semibold">Send a Message</h2>
		<form class="space-y-4" method="POST" action="/api/contact" onsubmit={handleSubmit}>
			<div>
				<Label class="mb-1 block font-medium" for="name">Name</Label>
				<Input
					id="name"
					name="name"
					type="text"
					bind:value={name}
					aria-invalid={fieldErrors.name ? 'true' : undefined}
					onblur={() => touchField('name')}
					oninput={() => handleFieldInput('name')}
					required
				/>
				{#if fieldErrors.name}<p class="mt-1 text-sm text-destructive">{fieldErrors.name}</p>{/if}
			</div>
			<div>
				<Label class="mb-1 block font-medium" for="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					aria-invalid={fieldErrors.email ? 'true' : undefined}
					onblur={() => touchField('email')}
					oninput={() => handleFieldInput('email')}
					required
				/>
				{#if fieldErrors.email}<p class="mt-1 text-sm text-destructive">{fieldErrors.email}</p>{/if}
			</div>
			<div>
				<Label class="mb-1 block font-medium" for="message">Message</Label>
				<Textarea
					id="message"
					name="message"
					rows={5}
					bind:value={message}
					aria-invalid={fieldErrors.message ? 'true' : undefined}
					onblur={() => touchField('message')}
					oninput={() => handleFieldInput('message')}
					required
				/>
				{#if fieldErrors.message}<p class="mt-1 text-sm text-destructive">
						{fieldErrors.message}
					</p>{/if}
			</div>
			<div class="sr-only">
				<Label for="website">Website</Label>
				<Input id="website" name="website" bind:value={website} tabindex={-1} autocomplete="off" />
			</div>
			{#if successMessage}
				<p
					class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800"
				>
					{successMessage}
				</p>
			{/if}
			{#if errorMessage}
				<p
					class="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
				>
					{errorMessage}
				</p>
			{/if}
			<Button type="submit" size="lg" class="mt-2 w-full gap-2" disabled={isSubmitting}>
				<Send class="size-4" />
				{isSubmitting ? 'Sending...' : 'Send Message'}
			</Button>
		</form>
	</Card.Root>
{/snippet}

{#if page}
	<ContactPageSections sections={page.sections} {contactForm} />
{/if}
