<script lang="ts">
	import { resolve } from '$app/paths';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import { validateEmail } from '$lib/auth/validation.js';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let email = $state('');
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let fieldError = $state('');
	let emailTouched = $state(false);

	const validateForm = () => {
		fieldError = validateEmail(email);
		emailTouched = true;
		return !fieldError;
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (!validateForm()) {
			return;
		}

		isSubmitting = true;
		errorMessage = '';
		successMessage = '';

		const result = await authRequest<{ status: boolean; message: string }>(
			'/api/auth/request-password-reset',
			{
				method: 'POST',
				body: JSON.stringify({
					email,
					redirectTo: '/reset-password'
				})
			}
		);

		if (!result.ok || !result.data) {
			errorMessage = getAuthErrorMessage(result, 'We could not start the password reset flow.');
			isSubmitting = false;
			return;
		}

		successMessage = 'If an account matches that email, we’ve sent a link to reset your password.';
		isSubmitting = false;
	};
</script>

<AuthShell title="Reset your password" description="Enter your email and we'll send a reset link">
	<form class="space-y-5" onsubmit={handleSubmit}>
		<div class="space-y-2">
			<Label for="forgot-email">Email</Label>
			<Input
				id="forgot-email"
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				aria-invalid={fieldError ? 'true' : undefined}
				onblur={() => {
					emailTouched = true;
					fieldError = validateEmail(email);
				}}
				oninput={() => {
					if (emailTouched) {
						fieldError = validateEmail(email);
					}
				}}
				required
			/>
			{#if fieldError}
				<p class="text-sm text-destructive">{fieldError}</p>
			{/if}
		</div>

		{#if errorMessage}
			<p
				class="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
			>
				{errorMessage}
			</p>
		{/if}

		{#if successMessage}
			<p class="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
				{successMessage}
			</p>
		{/if}

		<Button type="submit" class="w-full" disabled={isSubmitting}>
			{isSubmitting ? 'Sending link...' : 'Send reset link'}
		</Button>
	</form>

	{#snippet footer()}
		<span>Remembered it?</span>
		<a href={resolve('/login')} class="font-medium text-primary hover:underline">Back to login</a>
	{/snippet}
</AuthShell>
