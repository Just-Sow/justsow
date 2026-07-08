<script lang="ts">
	import { Eye, EyeOff } from '@lucide/svelte';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import {
		buildFullName,
		normalizeNamePart,
		validateEmail,
		validateFirstName,
		validateLastName,
		validatePassword,
		validatePasswordConfirmation
	} from '$lib/auth/validation.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as InputGroup from '$lib/components/ui/input-group';
	import Label from '$lib/components/ui/label/label.svelte';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let fieldErrors = $state({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	let touched = $state({
		firstName: false,
		lastName: false,
		email: false,
		password: false,
		confirmPassword: false
	});

	const validateField = (field: keyof typeof fieldErrors) => {
		switch (field) {
			case 'firstName':
				fieldErrors.firstName = validateFirstName(firstName);
				return !fieldErrors.firstName;
			case 'lastName':
				fieldErrors.lastName = validateLastName(lastName);
				return !fieldErrors.lastName;
			case 'email':
				fieldErrors.email = validateEmail(email);
				return !fieldErrors.email;
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
		if (field === 'firstName' || field === 'lastName') {
			successMessage = '';
		}

		if (touched[field]) {
			validateField(field);
		}
	};

	const validateForm = () => {
		touched.firstName = true;
		touched.lastName = true;
		touched.email = true;
		touched.password = true;
		touched.confirmPassword = true;

		const firstNameValid = validateField('firstName');
		const lastNameValid = validateField('lastName');
		const emailValid = validateField('email');
		const passwordValid = validateField('password');
		const confirmPasswordValid = validateField('confirmPassword');

		return firstNameValid && lastNameValid && emailValid && passwordValid && confirmPasswordValid;
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (!validateForm()) {
			return;
		}

		isSubmitting = true;

		const result = await authRequest<{ user: { email: string } }>('/api/auth/sign-up/email', {
			method: 'POST',
			body: JSON.stringify({
				name: buildFullName(firstName, lastName),
				firstName: normalizeNamePart(firstName),
				lastName: normalizeNamePart(lastName),
				email,
				password,
				callbackURL: '/login'
			})
		});

		if (!result.ok || !result.data) {
			errorMessage = getAuthErrorMessage(result, 'We could not create your account.');
			isSubmitting = false;
			return;
		}

		successMessage =
			'Your account has been created. Check your email to verify it before signing in.';
		password = '';
		confirmPassword = '';
		isSubmitting = false;
	};
</script>

<AuthShell centered title="Create your account">
	<Card.Header class="gap-2 px-6 pt-6 pb-4 text-center">
		<Card.Title class="text-2xl">Create your account</Card.Title>
		<Card.Description>Sign up to get started.</Card.Description>
	</Card.Header>

	<Card.Content class="pb-4">
		<form class="space-y-5" onsubmit={handleSubmit}>
			<div class="grid gap-5 sm:grid-cols-2">
				<div class="space-y-2">
					<Label for="signup-first-name">First name</Label>
					<Input
						id="signup-first-name"
						bind:value={firstName}
						placeholder="First name"
						aria-invalid={fieldErrors.firstName ? 'true' : undefined}
						onblur={() => touchField('firstName')}
						oninput={() => handleFieldInput('firstName')}
						required
					/>
					{#if fieldErrors.firstName}
						<p class="text-sm text-destructive">{fieldErrors.firstName}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="signup-last-name">Last name</Label>
					<Input
						id="signup-last-name"
						bind:value={lastName}
						placeholder="Last name"
						aria-invalid={fieldErrors.lastName ? 'true' : undefined}
						onblur={() => touchField('lastName')}
						oninput={() => handleFieldInput('lastName')}
						required
					/>
					{#if fieldErrors.lastName}
						<p class="text-sm text-destructive">{fieldErrors.lastName}</p>
					{/if}
				</div>
			</div>

			<div class="space-y-2">
				<Label for="signup-email">Email</Label>
				<Input
					id="signup-email"
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

			<div class="space-y-5">
				<div class="space-y-2">
					<Label for="signup-password">Password</Label>
					<InputGroup.Root>
						<InputGroup.Input
							id="signup-password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="Create a password"
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
					<Label for="signup-confirm">Confirm password</Label>
					<InputGroup.Root>
						<InputGroup.Input
							id="signup-confirm"
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={confirmPassword}
							placeholder="Repeat password"
							aria-invalid={fieldErrors.confirmPassword ? 'true' : undefined}
							onblur={() => touchField('confirmPassword')}
							oninput={() => handleFieldInput('confirmPassword')}
							required
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button
								size="icon-xs"
								variant="ghost"
								aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
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
			</div>

			{#if errorMessage}
				<p class="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
					{errorMessage}
				</p>
			{/if}

			{#if successMessage}
				<p class="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
					{successMessage}
				</p>
			{/if}

			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{isSubmitting ? 'Creating account...' : 'Create account'}
			</Button>
		</form>
	</Card.Content>

	<Card.Footer class="justify-center gap-1 pt-0 pb-6 text-sm text-muted-foreground">
		<span>Already have an account?</span>
		<a href="/login" class="font-medium text-primary hover:underline">Sign in</a>
	</Card.Footer>
</AuthShell>
