<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Eye, EyeOff, KeyRound } from '@lucide/svelte';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import {
		validatePassword,
		validatePasswordConfirmation,
		validateRequired
	} from '$lib/auth/validation.js';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as InputGroup from '$lib/components/ui/input-group';
	import Label from '$lib/components/ui/label/label.svelte';

	type NoticeTone = 'success' | 'error';

	let {
		open = $bindable(false),
		onSaved
	}: {
		open?: boolean;
		onSaved?: (message: string) => void | Promise<void>;
	} = $props();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let revokeOtherSessions = $state(true);
	let showCurrentPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);
	let message = $state('');
	let tone = $state<NoticeTone>('success');
	let isSubmitting = $state(false);
	let errors = $state({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});
	let touched = $state({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false
	});

	$effect(() => {
		if (open) {
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			showCurrentPassword = false;
			showNewPassword = false;
			showConfirmPassword = false;
			message = '';
			errors.currentPassword = '';
			errors.newPassword = '';
			errors.confirmPassword = '';
			touched.currentPassword = false;
			touched.newPassword = false;
			touched.confirmPassword = false;
		}
	});

	const messageClasses = (value: NoticeTone) =>
		value === 'error'
			? 'border-destructive/20 bg-destructive/5 text-destructive'
			: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';

	const validateField = (field: keyof typeof errors) => {
		switch (field) {
			case 'currentPassword':
				errors.currentPassword = validateRequired(currentPassword, 'Current password is required.');
				return !errors.currentPassword;
			case 'newPassword':
				errors.newPassword = validatePassword(newPassword);
				if (touched.confirmPassword) {
					errors.confirmPassword = validatePasswordConfirmation(newPassword, confirmPassword);
				}
				return !errors.newPassword;
			case 'confirmPassword':
				errors.confirmPassword = validatePasswordConfirmation(newPassword, confirmPassword);
				return !errors.confirmPassword;
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
		touched.currentPassword = true;
		touched.newPassword = true;
		touched.confirmPassword = true;

		return (
			validateField('currentPassword') &&
			validateField('newPassword') &&
			validateField('confirmPassword')
		);
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		message = '';

		if (!validateForm()) {
			return;
		}

		isSubmitting = true;
		const result = await authRequest<{ user: { id: string } }>('/api/auth/change-password', {
			method: 'POST',
			body: JSON.stringify({
				currentPassword,
				newPassword,
				revokeOtherSessions
			})
		});
		isSubmitting = false;

		if (!result.ok) {
			tone = 'error';
			message = getAuthErrorMessage(result, 'We could not update your password.');
			return;
		}

		tone = 'success';
		message = 'Your password has been updated.';
		await invalidateAll();
		open = false;

		if (onSaved) {
			await onSaved(message);
		}

		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		errors.currentPassword = '';
		errors.newPassword = '';
		errors.confirmPassword = '';
		touched.currentPassword = false;
		touched.newPassword = false;
		touched.confirmPassword = false;
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-xl rounded-xl p-0 sm:max-w-xl">
		<div class="space-y-5 p-6">
			<Dialog.Header>
				<Dialog.Title>Change password</Dialog.Title>
				<Dialog.Description
					>Use a new password that meets the same security rules as sign-up.</Dialog.Description
				>
			</Dialog.Header>

			<form class="space-y-5" onsubmit={handleSubmit}>
				<div class="space-y-2">
					<Label for="settings-current-password">Current password</Label>
					<InputGroup.Root>
						<InputGroup.Input
							id="settings-current-password"
							type={showCurrentPassword ? 'text' : 'password'}
							bind:value={currentPassword}
							placeholder="Enter your current password"
							aria-invalid={errors.currentPassword ? 'true' : undefined}
							onblur={() => touchField('currentPassword')}
							oninput={() => handleFieldInput('currentPassword')}
							required
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button
								size="icon-xs"
								variant="ghost"
								aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
								aria-pressed={showCurrentPassword}
								class="rounded-full"
								onclick={() => (showCurrentPassword = !showCurrentPassword)}
							>
								{#if showCurrentPassword}
									<EyeOff />
								{:else}
									<Eye />
								{/if}
							</InputGroup.Button>
						</InputGroup.Addon>
					</InputGroup.Root>
					{#if errors.currentPassword}
						<p class="text-sm text-destructive">{errors.currentPassword}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="settings-new-password">New password</Label>
					<InputGroup.Root>
						<InputGroup.Input
							id="settings-new-password"
							type={showNewPassword ? 'text' : 'password'}
							bind:value={newPassword}
							placeholder="Choose a new password"
							aria-invalid={errors.newPassword ? 'true' : undefined}
							onblur={() => touchField('newPassword')}
							oninput={() => handleFieldInput('newPassword')}
							required
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button
								size="icon-xs"
								variant="ghost"
								aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
								aria-pressed={showNewPassword}
								class="rounded-full"
								onclick={() => (showNewPassword = !showNewPassword)}
							>
								{#if showNewPassword}
									<EyeOff />
								{:else}
									<Eye />
								{/if}
							</InputGroup.Button>
						</InputGroup.Addon>
					</InputGroup.Root>
					{#if errors.newPassword}
						<p class="text-sm text-destructive">{errors.newPassword}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="settings-confirm-password">Confirm new password</Label>
					<InputGroup.Root>
						<InputGroup.Input
							id="settings-confirm-password"
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={confirmPassword}
							placeholder="Repeat the new password"
							aria-invalid={errors.confirmPassword ? 'true' : undefined}
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
					{#if errors.confirmPassword}
						<p class="text-sm text-destructive">{errors.confirmPassword}</p>
					{/if}
				</div>

				<label class="flex items-center gap-3 text-sm text-muted-foreground">
					<Checkbox bind:checked={revokeOtherSessions} />
					Sign out other sessions after changing the password
				</label>

				{#if message}
					<p class={`rounded-lg border px-4 py-3 text-sm ${messageClasses(tone)}`}>{message}</p>
				{/if}

				<Dialog.Footer class="px-0 pb-0">
					<Button type="button" variant="outline" onclick={() => (open = false)}>Close</Button>
					<Button type="submit" disabled={isSubmitting}>
						<KeyRound />
						{isSubmitting ? 'Updating password...' : 'Update password'}
					</Button>
				</Dialog.Footer>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>
