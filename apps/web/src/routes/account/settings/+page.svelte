<script lang="ts">
	import { CircleAlert, CircleCheck, PencilLine, RotateCcwKey, ShieldAlert } from '@lucide/svelte';
	import { getAuthStore } from '$lib/auth/store.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import AccountInfoDialog from './account-info-dialog.svelte';
	import PasswordDialog from './password-dialog.svelte';
	import TwoFactorDialog from './two-factor-dialog.svelte';
	import type { PageData } from './$types';

	type NoticeTone = 'success' | 'error';

	let { data }: { data: PageData } = $props();

	const auth = getAuthStore();

	let nameDialogOpen = $state(false);
	let emailDialogOpen = $state(false);
	let phoneDialogOpen = $state(false);
	let passwordDialogOpen = $state(false);
	let twoFactorDialogOpen = $state(false);
	let pageMessage = $state('');
	let tone = $state<NoticeTone>('success');
	const timestampFormatter = new Intl.DateTimeFormat('en-AU', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	const messageClasses = (value: NoticeTone) =>
		value === 'error'
			? 'border-destructive/20 bg-destructive/5 text-destructive'
			: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';

	const handleSaved = (message: string) => {
		tone = 'success';
		pageMessage = message;
	};

	const formatTimestamp = (value: string | null | undefined, fallback: string) => {
		if (!value) {
			return fallback;
		}

		const date = new Date(value);

		if (Number.isNaN(date.getTime())) {
			return fallback;
		}

		return timestampFormatter.format(date);
	};

	const passwordBadgeText = $derived.by(() => {
		if ($auth?.user.passwordChangedAt) {
			return `Password changed ${formatTimestamp($auth.user.passwordChangedAt, 'recently')}`;
		}

		return `Password created ${formatTimestamp($auth?.user.createdAt, 'recently')}`;
	});

	const twoFactorBadgeText = $derived.by(() => {
		if (data.security?.twoFactor.enabled) {
			return `Enabled ${formatTimestamp(data.security.twoFactor.enabledAt, 'recently')}`;
		}

		return `Not enabled`;
	});
</script>

<section
	class="mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-4xl items-start justify-center px-4 py-12 sm:px-6"
>
	<div class="w-full max-w-2xl space-y-8">
		<div class="space-y-2 text-center">
			<p class="text-sm font-semibold tracking-[0.22em] text-primary uppercase">Your Account</p>
			<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Settings</h1>
		</div>

		{#if pageMessage}
			<p class={`rounded-lg border px-4 py-3 text-sm ${messageClasses(tone)}`}>{pageMessage}</p>
		{/if}

		<div class="space-y-8">
			<div class="space-y-4">
				<h2 class="text-sm font-semibold tracking-[0.16em] text-foreground uppercase">
					Account info
				</h2>

				<div
					class="border-border/70 divide-border/70 overflow-hidden rounded-xl border bg-background/95"
				>
					<div class="flex items-center justify-between gap-4 px-5 py-4">
						<div class="min-w-0 flex-1 space-y-1">
							<p class="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Name
							</p>
							<p class="truncate text-sm text-foreground">
								{$auth?.user.firstName}
								{$auth?.user.lastName}
							</p>
						</div>

						<Button type="button" variant="ghost" onclick={() => (nameDialogOpen = true)}>
							<PencilLine />
							Edit
						</Button>
					</div>

					<div class="border-border/70 flex items-center justify-between gap-4 border-t px-5 py-4">
						<div class="min-w-0 flex-1 space-y-1">
							<p class="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Email
							</p>
							<p class="truncate text-sm text-foreground">{$auth?.user.email}</p>
						</div>

						<Button type="button" variant="ghost" onclick={() => (emailDialogOpen = true)}>
							<PencilLine />
							Edit
						</Button>
					</div>

					<div class="border-border/70 flex items-center justify-between gap-4 border-t px-5 py-4">
						<div class="min-w-0 flex-1 space-y-1">
							<p class="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Phone
							</p>
							<p class="truncate text-sm text-foreground">
								{$auth?.user.phoneNumber || 'Add a phone number'}
							</p>
						</div>

						<Button type="button" variant="ghost" onclick={() => (phoneDialogOpen = true)}>
							<PencilLine />
							Edit
						</Button>
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<h2 class="text-sm font-semibold tracking-[0.16em] text-foreground uppercase">
					Password and security
				</h2>

				<div
					class="border-border/70 divide-border/70 overflow-hidden rounded-xl border bg-background/95"
				>
					<div class="flex items-center justify-between gap-4 px-5 py-4">
						<div class="min-w-0 flex-1 space-y-1">
							<p class="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Password
							</p>
							<Badge
								variant="outline"
								class="border-border bg-muted/50 px-2.5 py-1 text-foreground"
							>
								<RotateCcwKey />
								{passwordBadgeText}
							</Badge>
						</div>

						<Button type="button" variant="ghost" onclick={() => (passwordDialogOpen = true)}>
							<PencilLine />
							Edit
						</Button>
					</div>

					<div class="border-border/70 flex items-center justify-between gap-4 border-t px-5 py-4">
						<div class="min-w-0 flex-1 space-y-1">
							<p class="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Two-factor authentication
							</p>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<Badge
											variant={data.security?.twoFactor.enabled ? 'outline' : 'destructive'}
											class={data.security?.twoFactor.enabled
												? 'cursor-default border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-300'
												: 'cursor-help px-2.5 py-1'}
										>
											{#if data.security?.twoFactor.enabled}
												<CircleCheck />
											{:else}
												<CircleAlert />
											{/if}
											{twoFactorBadgeText}
										</Badge>
									</Tooltip.Trigger>
									{#if !data.security?.twoFactor.enabled}
										<Tooltip.Content sideOffset={8}>
											Two-factor authentication is required before setup is complete.
										</Tooltip.Content>
									{/if}
								</Tooltip.Root>
							</Tooltip.Provider>
						</div>

						<Button type="button" variant="ghost" onclick={() => (twoFactorDialogOpen = true)}>
							{#if !data.security?.twoFactor.enabled}
								<ShieldAlert />
							{:else}
								<PencilLine />
							{/if}
							{data.security?.twoFactor.enabled ? 'Edit' : 'Set up'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<AccountInfoDialog
	bind:open={nameDialogOpen}
	mode="name"
	initialFirstName={$auth?.user.firstName ?? ''}
	initialLastName={$auth?.user.lastName ?? ''}
	initialEmail={$auth?.user.email ?? ''}
	initialPhoneNumber={$auth?.user.phoneNumber ?? ''}
	onSaved={handleSaved}
/>

<AccountInfoDialog
	bind:open={emailDialogOpen}
	mode="email"
	initialFirstName={$auth?.user.firstName ?? ''}
	initialLastName={$auth?.user.lastName ?? ''}
	initialEmail={$auth?.user.email ?? ''}
	initialPhoneNumber={$auth?.user.phoneNumber ?? ''}
	onSaved={handleSaved}
/>

<AccountInfoDialog
	bind:open={phoneDialogOpen}
	mode="phone"
	initialFirstName={$auth?.user.firstName ?? ''}
	initialLastName={$auth?.user.lastName ?? ''}
	initialEmail={$auth?.user.email ?? ''}
	initialPhoneNumber={$auth?.user.phoneNumber ?? ''}
	onSaved={handleSaved}
/>

<PasswordDialog bind:open={passwordDialogOpen} onSaved={handleSaved} />

<TwoFactorDialog
	bind:open={twoFactorDialogOpen}
	initialSecurity={data.security}
	onSaved={handleSaved}
/>
