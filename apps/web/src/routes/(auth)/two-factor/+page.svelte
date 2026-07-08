<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
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
			mode === 'totp' ? '/api/auth/two-factor/verify-totp' : '/api/auth/two-factor/verify-backup-code';
		const field = mode === 'totp' ? { code } : { code };

		const result = await authRequest<{ user?: { id: string } }>(path, {
			method: 'POST',
			body: JSON.stringify({
				...field,
				trustDevice
			})
		});

		if (!result.ok) {
			errorMessage = getAuthErrorMessage(result, 'The verification code was not accepted.');
			isSubmitting = false;
			return;
		}

		await invalidateAll();
		await goto('/');
	};
</script>

<AuthShell
	eyebrow="Security Check"
	title="Complete two-factor authentication"
	description="Enter your authenticator code or use one of your backup codes to finish signing in."
>
	<Card.Header class="space-y-2">
		<Card.Title>Two-factor verification</Card.Title>
		<Card.Description>
			Privileged roles require two-factor before account access is fully granted.
		</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-5">
		<div class="grid grid-cols-2 gap-2">
			<Button type="button" variant={mode === 'totp' ? 'default' : 'outline'} onclick={() => (mode = 'totp')}>
				Authenticator code
			</Button>
			<Button
				type="button"
				variant={mode === 'backup' ? 'default' : 'outline'}
				onclick={() => (mode = 'backup')}
			>
				Backup code
			</Button>
		</div>

		<form class="space-y-5" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="two-factor-code">{mode === 'totp' ? 'Code' : 'Backup code'}</Label>
				<Input
					id="two-factor-code"
					bind:value={code}
					inputmode="numeric"
					placeholder={mode === 'totp' ? '123456' : 'Enter a backup code'}
					required
				/>
			</div>

			<label class="flex items-center gap-3 text-sm text-muted-foreground">
				<input type="checkbox" bind:checked={trustDevice} class="size-4 rounded border-border" />
				Trust this device for future sign-ins
			</label>

			{#if errorMessage}
				<p class="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
					{errorMessage}
				</p>
			{/if}

			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{isSubmitting ? 'Verifying...' : 'Verify and continue'}
			</Button>
		</form>
	</Card.Content>

	<Card.Footer class="justify-center text-sm text-muted-foreground">
		<a href="/login" class="hover:text-primary">Back to login</a>
	</Card.Footer>
</AuthShell>
