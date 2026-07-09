<script lang="ts">
	import { Eye, EyeOff } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import { validatePassword, validatePasswordConfirmation } from '$lib/auth/validation.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as InputGroup from '$lib/components/ui/input-group';
	import Label from '$lib/components/ui/label/label.svelte';

	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let fieldErrors = $state({
		password: '',
		confirmPassword: ''
	});
	let touched = $state({
		password: false,
		confirmPassword: false
	});

	const token = page.params.token;

	const validateField = (field: keyof typeof fieldErrors) => {
		switch (field) {
			case 'password':
				fieldErrors.password = validatePassword(password);
				if (touched.confirmPassword) {
					fieldErrors.confirmPassword = validatePasswordConfirmation(password, confirmPassword);
				}
				return !fieldErrors.password;
			case 'confirmPassword':
				fieldErrors.confirmPassword = validatePasswordConfirmation(password, confirmPassword);
				return !fieldErrors.confirmPassword;
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
		touched.password = true;
		touched.confirmPassword = true;

		const passwordValid = validateField('password');
		const confirmPasswordValid = validateField('confirmPassword');

		return passwordValid && confirmPasswordValid;
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (!validateForm()) {
			return;
		}

		isSubmitting = true;
		const result = await authRequest<{ status: boolean }>(
			`/api/auth/reset-password?token=${token}`,
			{
				method: 'POST',
				body: JSON.stringify({
					newPassword: password
				})
			}
		);

		if (!result.ok) {
			errorMessage = getAuthErrorMessage(result, 'We could not reset the password with this link.');
			isSubmitting = false;
			return;
		}

		successMessage = 'Your password has been reset. You can now sign in with the new password.';
		isSubmitting = false;
		await goto(resolve('/login'));
	};
</script>

<AuthShell
	title="Reset password"
	description="Your new password will replace the previous one immediately"
>
	<Card.Content>
		<form class="space-y-5" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="reset-password">New password</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="reset-password"
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						placeholder="Create a new password"
						aria-invalid={fieldErrors.password ? 'true' : undefined}
						onblur={() => touchField('password')}
						oninput={() => handleFieldInput('password')}
						required
					/>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							size="icon-xs"
							variant="ghost"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							aria-pressed={showPassword}
							class="rounded-full"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff />
							{:else}
								<Eye />
							{/if}
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
				{#if fieldErrors.password}
					<p class="text-sm text-destructive">{fieldErrors.password}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="reset-confirm">Confirm password</Label>
				<InputGroup.Root>
					<InputGroup.Input
						id="reset-confirm"
						type={showConfirmPassword ? 'text' : 'password'}
						bind:value={confirmPassword}
						placeholder="Repeat new password"
						aria-invalid={fieldErrors.confirmPassword ? 'true' : undefined}
						onblur={() => touchField('confirmPassword')}
						oninput={() => handleFieldInput('confirmPassword')}
						required
					/>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							size="icon-xs"
							variant="ghost"
							aria-label={showConfirmPassword
								? 'Hide password confirmation'
								: 'Show password confirmation'}
							aria-pressed={showConfirmPassword}
							class="rounded-full"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
						>
							{#if showConfirmPassword}
								<EyeOff />
							{:else}
								<Eye />
							{/if}
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
				{#if fieldErrors.confirmPassword}
					<p class="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
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
				<p
					class="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground"
				>
					{successMessage}
				</p>
			{/if}

			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{isSubmitting ? 'Saving password...' : 'Save new password'}
			</Button>
		</form>
	</Card.Content>
</AuthShell>
