<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Camera, Send, Users, X, Mail } from '@lucide/svelte';

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

	const socialLinks = [
			{
				href: 'https://www.instagram.com/officialjustsow/',
				label: 'Instagram',
				handle: '@officialjustsow',
				icon: Camera
			},
			{
				href: 'https://www.facebook.com/JustSowGiving/',
				label: 'Facebook',
				handle: '/JustSowGiving',
				icon: Users
			},
			{
				href: 'https://x.com/just_sow',
				label: 'X',
				handle: '@just_sow',
				icon: X
			}
	];

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
					message.trim().length >= 20
						? ''
						: 'Tell us a little more so we can respond properly.';
				return !fieldErrors.message;
		}
	};

	const touchField = (field: keyof typeof touched) => {
		touched[field] = true;
		validateField(field);
	};

	const handleFieldInput = (field: keyof typeof touched) => {
		if (touched[field]) {
			validateField(field);
		}
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
		fieldErrors = {
			name: '',
			email: '',
			message: ''
		};
		touched = {
			name: false,
			email: false,
			message: false
		};
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		successMessage = '';
		errorMessage = '';

		if (!validateForm()) {
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					message: message.trim(),
					website: website.trim()
				})
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as {
					message?: string;
				} | null;
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
	<title>Contact | JustSow</title>
	<meta
		name="description"
		content="Contact JustSow about a question, project, or support request."
	/>
</svelte:head>

<section class="bg-amber-50 py-20">
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8"
	>
		<div>
			<h2 class="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">Get in Touch</h2>
			<p class="mb-6 text-lg">
				We’d love to hear from you! Whether you have questions about applying for a seed grant, want
				to share a new idea, or just want to connect, you can reach us using the form below or via
				our contact info.
			</p>

			<div class="space-y-4 text-lg">
				<div class="flex items-center space-x-3">
					<Mail class="h-6 w-6 text-primary" />
					<a href="mailto:info@justsow.org" class="inline-flex w-fit hover:text-primary">
						info@justsow.org
					</a>
				</div>

				<div class="space-y-3">
					<p class="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
						Connect on socials
					</p>
					<ul class="space-y-3">
						{#each socialLinks as socialLink (socialLink.href)}
							<li class="w-fit">
								<a
									href={socialLink.href}
									target="_blank"
									rel="noreferrer"
									class="inline-flex w-fit items-center space-x-3 text-base transition-colors hover:text-primary"
								>
									<socialLink.icon class="h-6 w-6 text-primary" />
									<span>{socialLink.handle}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<div>
			<Card.Root class="rounded-2xl bg-white p-8 shadow-lg">
				<h3 class="mb-6 text-2xl font-semibold">Send a Message</h3>
				<form class="space-y-4" method="POST" action="/api/contact">
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
						{#if fieldErrors.name}
							<p class="mt-1 text-sm text-destructive">{fieldErrors.name}</p>
						{/if}
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
						{#if fieldErrors.email}
							<p class="mt-1 text-sm text-destructive">{fieldErrors.email}</p>
						{/if}
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
						{#if fieldErrors.message}
							<p class="mt-1 text-sm text-destructive">{fieldErrors.message}</p>
						{/if}
					</div>
					<div class="sr-only">
						<Label for="website">Website</Label>
						<Input id="website" name="website" bind:value={website} tabindex={-1} autocomplete="off" />
					</div>

					{#if successMessage}
						<p class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800">
							{successMessage}
						</p>
					{/if}

					{#if errorMessage}
						<p class="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
							{errorMessage}
						</p>
					{/if}

					<Button type="submit" size="lg" class="mt-2 w-full gap-2" disabled={isSubmitting}>
						<Send class="size-4" />
						{isSubmitting ? 'Sending...' : 'Send Message'}
					</Button>
				</form>
			</Card.Root>
		</div>
	</div>
</section>

<!-- Optional Map / Background Image -->
<section class="relative py-20">
	<img
		src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1470&auto=format&fit=crop"
		alt="Global mission map"
		class="absolute inset-0 h-full w-full object-cover brightness-40"
	/>
	<div class="relative mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
		<h2 class="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">Join Our Mission</h2>
		<p class="mx-auto mb-8 max-w-2xl text-lg">
			We’re always looking to connect with creative evangelists, supporters, and friends of JustSow.
			Reach out and help us scatter seeds of hope across the nations.
		</p>
		<Button size="lg" variant="secondary" href="/apply">Apply for a Seed Grant</Button>
	</div>
</section>
