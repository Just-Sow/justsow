<script lang="ts">
	import { tick } from 'svelte';
	import Icon from '@iconify/svelte';
	import { Check, ChevronsUpDown } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import {
		defaultPhoneCountry,
		findPhoneCountryOption,
		formatPhoneNumberForCountry,
		parseStoredPhoneNumber,
		phoneCountryOptions,
		toE164PhoneNumber
	} from '$lib/auth/phone-countries.js';
	import {
		buildFullName,
		validateEmail,
		validateFirstName,
		validateLastName
	} from '$lib/auth/validation.js';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils.js';

	type NoticeTone = 'success' | 'error';
	type EditMode = 'name' | 'email' | 'phone';

	let {
		open = $bindable(false),
		mode,
		initialFirstName,
		initialLastName,
		initialEmail,
		initialPhoneNumber,
		onSaved
	}: {
		open?: boolean;
		mode: EditMode;
		initialFirstName: string;
		initialLastName: string;
		initialEmail: string;
		initialPhoneNumber: string;
		onSaved?: (message: string) => void | Promise<void>;
	} = $props();

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phoneNumber = $state('');
	let phoneCountryCode = $state(defaultPhoneCountry.code);
	let isSaving = $state(false);
	let message = $state('');
	let tone = $state<NoticeTone>('success');
	let countryComboboxOpen = $state(false);
	let countryTriggerRef = $state<HTMLButtonElement>(null!);
	let errors = $state({
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: ''
	});
	let touched = $state({
		firstName: false,
		lastName: false,
		email: false,
		phoneNumber: false
	});

	$effect(() => {
		if (open) {
			firstName = initialFirstName;
			lastName = initialLastName;
			email = initialEmail;
			const parsedPhoneNumber = initialPhoneNumber
				? parseStoredPhoneNumber(initialPhoneNumber)
				: { country: defaultPhoneCountry, localNumber: '' };
			phoneCountryCode = parsedPhoneNumber.country.code;
			phoneNumber = parsedPhoneNumber.localNumber;
			errors.firstName = '';
			errors.lastName = '';
			errors.email = '';
			errors.phoneNumber = '';
			touched.firstName = false;
			touched.lastName = false;
			touched.email = false;
			touched.phoneNumber = false;
			message = '';
		}
	});

	const messageClasses = (value: NoticeTone) =>
		value === 'error'
			? 'border-destructive/20 bg-destructive/5 text-destructive'
			: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';

	const validateField = (field: keyof typeof errors) => {
		switch (field) {
			case 'firstName':
				errors.firstName = validateFirstName(firstName);
				return !errors.firstName;
			case 'lastName':
				errors.lastName = validateLastName(lastName);
				return !errors.lastName;
			case 'email':
				errors.email = validateEmail(email);
				return !errors.email;
			case 'phoneNumber':
				errors.phoneNumber = validatePhoneNumber();
				return !errors.phoneNumber;
		}
	};

	const validatePhoneNumber = () => {
		if (!phoneNumber.trim()) {
			return '';
		}

		return toE164PhoneNumber(phoneNumber, phoneCountryCode) ? '' : 'Enter a valid phone number.';
	};

	const touchField = (field: keyof typeof touched) => {
		touched[field] = true;
		validateField(field);
	};

	const handleFieldInput = (field: keyof typeof touched) => {
		if (field === 'phoneNumber') {
			phoneNumber = formatPhoneNumberForCountry(phoneNumber, phoneCountryCode);
		}

		if (touched[field]) {
			validateField(field);
		}
	};

	const selectedPhoneCountry = $derived.by(
		() => findPhoneCountryOption(phoneCountryCode) ?? defaultPhoneCountry
	);

	const closeAndFocusCountryTrigger = () => {
		countryComboboxOpen = false;
		tick().then(() => {
			countryTriggerRef?.focus();
		});
	};

	const validateForm = () => {
		if (mode === 'name') {
			touched.firstName = true;
			touched.lastName = true;
			return validateField('firstName') && validateField('lastName');
		}

		if (mode === 'phone') {
			touched.phoneNumber = true;
			return validateField('phoneNumber');
		}

		touched.email = true;
		return validateField('email');
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		message = '';

		if (!validateForm()) {
			return;
		}

		isSaving = true;

		if (mode === 'name') {
			const result = await authRequest<{ status: boolean }>('/api/auth/update-user', {
				method: 'POST',
				body: JSON.stringify({
					name: buildFullName(firstName, lastName),
					firstName,
					lastName
				})
			});

			if (!result.ok) {
				isSaving = false;
				tone = 'error';
				message = getAuthErrorMessage(result, 'We could not update your name.');
				return;
			}
		} else if (mode === 'email') {
			const result = await authRequest<{ status: boolean }>('/api/auth/change-email', {
				method: 'POST',
				body: JSON.stringify({
					newEmail: email,
					callbackURL: '/account/settings'
				})
			});

			if (!result.ok) {
				isSaving = false;
				tone = 'error';
				message = getAuthErrorMessage(result, 'We could not update your email.');
				return;
			}
		} else {
			const normalizedPhoneNumber = phoneNumber.trim()
				? toE164PhoneNumber(phoneNumber, phoneCountryCode)
				: null;
			const result = await authRequest<{ status: boolean }>('/api/auth/update-user', {
				method: 'POST',
				body: JSON.stringify({
					phoneNumber: normalizedPhoneNumber
				})
			});

			if (!result.ok) {
				isSaving = false;
				tone = 'error';
				message = getAuthErrorMessage(result, 'We could not update your phone number.');
				return;
			}
		}

		await invalidateAll();
		isSaving = false;
		tone = 'success';
		open = false;

		if (onSaved) {
			await onSaved(
				mode === 'email'
					? 'Your details were saved. Check your inbox to confirm the email change.'
					: mode === 'phone'
						? 'Your phone number was updated.'
						: 'Your details were saved.'
			);
		}
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-lg rounded-xl p-0 sm:max-w-lg">
		<div class="space-y-5 p-6">
			<Dialog.Header>
				<Dialog.Title>
					{mode === 'name' ? 'Edit name' : mode === 'email' ? 'Edit email' : 'Edit phone number'}
				</Dialog.Title>
			</Dialog.Header>

			<form class="space-y-5" onsubmit={handleSubmit}>
				{#if mode === 'name'}
					<div class="grid gap-5 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="settings-first-name">First name</Label>
							<Input
								id="settings-first-name"
								bind:value={firstName}
								placeholder="First name"
								aria-invalid={errors.firstName ? 'true' : undefined}
								onblur={() => touchField('firstName')}
								oninput={() => handleFieldInput('firstName')}
								required
							/>
							{#if errors.firstName}
								<p class="text-sm text-destructive">{errors.firstName}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="settings-last-name">Last name</Label>
							<Input
								id="settings-last-name"
								bind:value={lastName}
								placeholder="Last name"
								aria-invalid={errors.lastName ? 'true' : undefined}
								onblur={() => touchField('lastName')}
								oninput={() => handleFieldInput('lastName')}
								required
							/>
							{#if errors.lastName}
								<p class="text-sm text-destructive">{errors.lastName}</p>
							{/if}
						</div>
					</div>
				{:else if mode === 'email'}
					<div class="space-y-2">
						<Label for="settings-email">Email</Label>
						<Input
							id="settings-email"
							type="email"
							bind:value={email}
							placeholder="you@example.com"
							aria-invalid={errors.email ? 'true' : undefined}
							onblur={() => touchField('email')}
							oninput={() => handleFieldInput('email')}
							required
						/>
						{#if errors.email}
							<p class="text-sm text-destructive">{errors.email}</p>
						{/if}
					</div>
				{:else}
					<div class="space-y-4">
						<Label for="settings-phone-number">Phone number</Label>
						<div class="grid gap-3 sm:grid-cols-[minmax(0,14rem)_1fr]">
							<div class="space-y-2">
								<Label for="settings-phone-country">Country</Label>
								<Popover.Root bind:open={countryComboboxOpen}>
									<Popover.Trigger bind:ref={countryTriggerRef}>
										{#snippet child({ props })}
											<Button
												{...props}
												id="settings-phone-country"
												type="button"
												variant="outline"
												class="w-full justify-between"
												role="combobox"
												aria-expanded={countryComboboxOpen}
											>
												<span class="flex min-w-0 items-center gap-2">
													<Icon
														icon={`flagpack:${selectedPhoneCountry.code.toLowerCase()}`}
														class="size-4 shrink-0"
													/>
													<span class="truncate">{selectedPhoneCountry.code}</span>
													<span class="text-muted-foreground"
														>{selectedPhoneCountry.callingCode}</span
													>
												</span>
												<ChevronsUpDown class="size-4 shrink-0 opacity-50" />
											</Button>
										{/snippet}
									</Popover.Trigger>
									<Popover.Content class="w-[18rem] p-0">
										<Command.Root>
											<Command.Input placeholder="Search country..." />
											<Command.List>
												<Command.Empty>No country found.</Command.Empty>
												<Command.Group>
													{#each phoneCountryOptions as country (country.code)}
														<Command.Item
															value={country.searchValue}
															onSelect={() => {
																phoneCountryCode = country.code;
																phoneNumber = formatPhoneNumberForCountry(
																	phoneNumber,
																	country.code
																);
																if (touched.phoneNumber) {
																	errors.phoneNumber = validatePhoneNumber();
																}
																closeAndFocusCountryTrigger();
															}}
														>
															<Check
																class={cn(
																	'mr-2 size-4',
																	phoneCountryCode !== country.code && 'text-transparent'
																)}
															/>
															<Icon
																icon={`flagpack:${country.code.toLowerCase()}`}
																class="mr-2 size-4 shrink-0"
															/>
															<span class="flex-1 truncate">{country.name}</span>
															<span class="text-muted-foreground">{country.callingCode}</span>
														</Command.Item>
													{/each}
												</Command.Group>
											</Command.List>
										</Command.Root>
									</Popover.Content>
								</Popover.Root>
							</div>

							<div class="space-y-2">
								<Label for="settings-phone-number">Local number</Label>
								<Input
									id="settings-phone-number"
									type="tel"
									bind:value={phoneNumber}
									placeholder="Enter your phone number"
									aria-invalid={errors.phoneNumber ? 'true' : undefined}
									onblur={() => touchField('phoneNumber')}
									oninput={() => handleFieldInput('phoneNumber')}
								/>
								{#if errors.phoneNumber}
									<p class="text-sm text-destructive">{errors.phoneNumber}</p>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				{#if message}
					<p class={`rounded-lg border px-4 py-3 text-sm ${messageClasses(tone)}`}>{message}</p>
				{/if}

				<Dialog.Footer class="px-0 pb-0">
					<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
					<Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
				</Dialog.Footer>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>
