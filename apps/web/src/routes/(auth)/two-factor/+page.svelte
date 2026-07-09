<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { CircleAlert, CircleCheck } from '@lucide/svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import Label from '$lib/components/ui/label/label.svelte';

	type ChallengeMode = 'totp' | 'backup';

	let mode = $state<ChallengeMode>('totp');
	let code = $state('');
	let trustDevice = $state(true);
	let isSubmitting = $state(false);
	let errorMessage = $state('');

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		isSubmitting = true;
		errorMessage = '';

		const path =
			mode === 'totp'
				? '/api/auth/two-factor/verify-totp'
				: '/api/auth/two-factor/verify-backup-code';

		const result = await authRequest<{ user?: { id: string } }>(path, {
			method: 'POST',
			body: JSON.stringify({
				code,
				trustDevice
			})
		});

		if (!result.ok) {
			errorMessage = getAuthErrorMessage(result, 'The verification code was not accepted.');
			isSubmitting = false;
			return;
		}

		await invalidateAll();
		await goto(resolve('/'));
	};
</script>

<AuthShell title="Two-factor verification" description="Use the code from your authenticator app">
	<form class="space-y-5 text-left" onsubmit={handleSubmit}>
		<div class="space-y-1.5">
			<Label for="two-factor-code">{mode === 'totp' ? 'Authenticator code' : 'Backup code'}</Label>
			{#if mode === 'totp'}
				<InputOTP.Root
					id="two-factor-code"
					bind:value={code}
					maxlength={6}
					pattern="^\d+$"
					required
				>
					{#snippet children({ cells })}
						<InputOTP.Group
							class="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border"
						>
							{#each cells as cell (cell)}
								<InputOTP.Slot
									{cell}
									class="size-11 border text-base font-semibold first:rounded-md first:border last:rounded-md"
								/>
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<p class="text-sm text-muted-foreground">
					Use the code currently shown in your authenticator app.
				</p>
			{:else}
				<input
					id="two-factor-code"
					bind:value={code}
					class="border-border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					placeholder="Enter a backup code"
					required
				/>
				<p class="text-sm text-muted-foreground">Backup codes are single-use reserve codes.</p>
			{/if}
		</div>

		<div class="flex flex-wrap items-center justify-between gap-3">
			<label class="flex items-center gap-3 text-sm text-muted-foreground">
				<Checkbox bind:checked={trustDevice} />
				Trust this device for future sign-ins
			</label>
		</div>

		{#if errorMessage}
			<p
				class="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
			>
				{errorMessage}
			</p>
		{/if}

		<Button type="submit" class="w-full" disabled={isSubmitting}>
			{#if mode === 'totp'}
				<CircleCheck />
			{:else}
				<CircleAlert />
			{/if}
			{isSubmitting ? 'Verifying...' : 'Verify and continue'}
		</Button>
	</form>

	{#snippet footer()}
		<div class="w-full flex justify-between gap-3">
			<button
				type="button"
				class="cursor-pointer hover:text-primary"
				onclick={() => {
					mode = mode === 'totp' ? 'backup' : 'totp';
					code = '';
					errorMessage = '';
				}}
			>
				{mode === 'totp' ? 'Use a backup code instead' : 'Back to authenticator code'}
			</button>
			<a href={resolve('/login')} class="text-primary hover:underline">Back to login</a>
		</div>
	{/snippet}
</AuthShell>
