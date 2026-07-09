<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import { validateEmail, validateRequired } from '$lib/auth/validation.js';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let email = $state('');
	let password = $state('');
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let verificationMessage = $state('');
	let fieldErrors = $state({
		email: '',
		password: ''
	});
	let touched = $state({
		email: false,
		password: false
	});

	const validateField = (field: keyof typeof fieldErrors) => {
		switch (field) {
			case 'email':
				fieldErrors.email = validateEmail(email);
				return !fieldErrors.email;
			case 'password':
				fieldErrors.password = validateRequired(password, 'Password is required.');
				return !fieldErrors.password;
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
		touched.email = true;
		touched.password = true;
		return validateField('email') && validateField('password');
	};

	const resendVerificationEmail = async () => {
		verificationMessage = '';
		const result = await authRequest<{ status: boolean }>('/api/auth/send-verification-email', {
			method: 'POST',
			body: JSON.stringify({
				email,
				callbackURL: '/login'
			})
		});

		if (!result.ok) {
			errorMessage = getAuthErrorMessage(result, 'We could not resend the verification email.');
			return;
		}

		verificationMessage =
			'If that account exists and still needs verification, a new verification email has been sent.';
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (!validateForm()) {
			return;
		}

		isSubmitting = true;
		errorMessage = '';
		verificationMessage = '';

		const result = await authRequest<{
			twoFactorRedirect?: boolean;
			user?: {
				id: string;
			};
		}>('/api/auth/sign-in/email', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password,
				callbackURL: '/'
			})
		});

		if (!result.ok) {
			errorMessage = getAuthErrorMessage(result, 'We could not sign you in.');
			isSubmitting = false;
			return;
		}

		if (result.data?.twoFactorRedirect) {
			await goto(resolve('/two-factor'));
			return;
		}

		await invalidateAll();
		await goto(resolve('/'));
	};
</script>

<AuthShell title="Welcome back" description="Login to your account">
	<form class="space-y-5" onsubmit={handleSubmit}>
		<div class="space-y-2">
			<Label for="login-email">Email</Label>
			<Input
				id="login-email"
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				aria-invalid={fieldErrors.email ? 'true' : undefined}
				onblur={() => touchField('email')}
				oninput={() => handleFieldInput('email')}
				required
			/>
			{#if fieldErrors.email}
				<p class="text-sm text-destructive">{fieldErrors.email}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<div class="flex items-center justify-between gap-3">
				<Label for="login-password">Password</Label>
				<a
					href={resolve('/forgot-password')}
					class="text-sm text-muted-foreground hover:text-primary"
				>
					Forgot password?
				</a>
			</div>
			<Input
				id="login-password"
				type="password"
				bind:value={password}
				placeholder="Enter your password"
				aria-invalid={fieldErrors.password ? 'true' : undefined}
				onblur={() => touchField('password')}
				oninput={() => handleFieldInput('password')}
				required
			/>
			{#if fieldErrors.password}
				<p class="text-sm text-destructive">{fieldErrors.password}</p>
			{/if}
		</div>

		{#if errorMessage}
			<div
				class="space-y-3 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-3 text-sm"
			>
				<p class="text-destructive">{errorMessage}</p>
				{#if errorMessage.toLowerCase().includes('verification')}
					<Button type="button" variant="outline" size="sm" onclick={resendVerificationEmail}>
						Resend verification email
					</Button>
				{/if}
			</div>
		{/if}

		{#if verificationMessage}
			<p class="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
				{verificationMessage}
			</p>
		{/if}

		<Button type="submit" class="w-full" disabled={isSubmitting}>
			{isSubmitting ? 'Signing in...' : 'Sign in'}
		</Button>
	</form>

	{#snippet footer()}
		<span>Don’t have an account?</span>
		<a href={resolve('/signup')} class="font-medium text-primary hover:underline">Create one</a>
	{/snippet}
</AuthShell>
