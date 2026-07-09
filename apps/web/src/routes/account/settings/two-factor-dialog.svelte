<script lang="ts">
	import {
		Copy,
		Download,
		Eye,
		EyeOff,
		ShieldCheck,
		SmartphoneNfc,
		TriangleAlert
	} from '@lucide/svelte';
	import QRCode from 'qrcode';
	import { invalidateAll } from '$app/navigation';
	import { authRequest, getAuthErrorMessage } from '$lib/auth/client.js';
	import type { AuthSecurityViewer } from '$lib/auth/session.js';
	import { validateRequired } from '$lib/auth/validation.js';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	type NoticeTone = 'success' | 'error' | 'info';
	type Stage =
		| 'password'
		| 'authenticator'
		| 'verify'
		| 'backup'
		| 'manage'
		| 'trusted-devices'
		| 'regenerate'
		| 'disable';

	interface TwoFactorEnableResponse {
		totpURI: string;
		backupCodes: string[];
	}

	interface StatusResponse {
		status: boolean;
	}

	interface GenerateBackupCodesResponse extends StatusResponse {
		backupCodes: string[];
	}

	let {
		open = $bindable(false),
		initialSecurity,
		onSaved
	}: {
		open?: boolean;
		initialSecurity: AuthSecurityViewer | null;
		onSaved?: (message: string) => void | Promise<void>;
	} = $props();

	let securityOverride = $state<AuthSecurityViewer | null>(null);
	const security = $derived(securityOverride ?? initialSecurity);
	let stage = $state<Stage>('password');
	let setupPassword = $state('');
	let showSetupPassword = $state(false);
	let isEnabling = $state(false);
	let pendingTotpUri = $state('');
	let pendingBackupCodes = $state<string[]>([]);
	let verificationCode = $state('');
	let qrCodeDataUrl = $state('');
	let showManualKey = $state(false);
	let isVerifying = $state(false);
	let recoveryPassword = $state('');
	let showRecoveryPassword = $state(false);
	let isRegenerating = $state(false);
	let latestBackupCodes = $state<string[]>([]);
	let copiedBackupCodes = $state(false);
	let isClearingTrustedDevices = $state(false);
	let disablePassword = $state('');
	let showDisablePassword = $state(false);
	let isDisabling = $state(false);
	let message = $state('');
	let tone = $state<NoticeTone>('info');

	$effect(() => {
		if (open) {
			setupPassword = '';
			showSetupPassword = false;
			pendingTotpUri = '';
			pendingBackupCodes = [];
			verificationCode = '';
			qrCodeDataUrl = '';
			showManualKey = false;
			recoveryPassword = '';
			showRecoveryPassword = false;
			disablePassword = '';
			showDisablePassword = false;
			copiedBackupCodes = false;
			message = '';
			tone = 'info';
			stage = security?.twoFactor.enabled ? 'manage' : 'password';
		}
	});

	$effect(() => {
		if (!pendingTotpUri) {
			qrCodeDataUrl = '';
			return;
		}

		let cancelled = false;

		QRCode.toDataURL(pendingTotpUri, {
			margin: 1,
			width: 208
		})
			.then((value: string) => {
				if (!cancelled) {
					qrCodeDataUrl = value;
				}
			})
			.catch(() => {
				if (!cancelled) {
					qrCodeDataUrl = '';
				}
			});

		return () => {
			cancelled = true;
		};
	});

	const messageClasses = (value: NoticeTone) => {
		if (value === 'error') {
			return 'border-destructive/20 bg-destructive/5 text-destructive';
		}

		if (value === 'success') {
			return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
		}

		return 'border-border bg-muted/40 text-muted-foreground';
	};

	const refreshSecurityState = async () => {
		await invalidateAll();
		const result = await authRequest<AuthSecurityViewer>('/auth/security');
		if (result.ok && result.data) {
			securityOverride = result.data;
		}
	};

	const setupSecret = $derived.by(() => {
		if (!pendingTotpUri) {
			return '';
		}

		try {
			return new URL(pendingTotpUri).searchParams.get('secret') ?? '';
		} catch {
			return '';
		}
	});

	const setupLabel = $derived.by(() => {
		if (!pendingTotpUri) {
			return '';
		}

		try {
			return decodeURIComponent(new URL(pendingTotpUri).pathname.replace(/^\//, ''));
		} catch {
			return '';
		}
	});

	const backupCodesText = $derived(latestBackupCodes.join('\n'));

	const startSetup = async (event: SubmitEvent) => {
		event.preventDefault();
		message = '';

		const passwordError = validateRequired(
			setupPassword,
			'Password is required to begin two-factor setup.'
		);

		if (passwordError) {
			tone = 'error';
			message = passwordError;
			return;
		}

		if (!security) {
			tone = 'error';
			message = 'Security controls are not available right now.';
			return;
		}

		isEnabling = true;
		const result = await authRequest<TwoFactorEnableResponse>(security.routes.manage.enable, {
			method: 'POST',
			body: JSON.stringify({
				password: setupPassword
			})
		});
		isEnabling = false;

		if (!result.ok || !result.data) {
			tone = 'error';
			message = getAuthErrorMessage(result, 'We could not start two-factor setup.');
			return;
		}

		pendingTotpUri = result.data.totpURI;
		pendingBackupCodes = result.data.backupCodes;
		verificationCode = '';
		showManualKey = false;
		stage = 'authenticator';
	};

	const finishSetup = async (event: SubmitEvent) => {
		event.preventDefault();
		message = '';

		const codeError = validateRequired(
			verificationCode,
			'Enter the code from your authenticator app.'
		);

		if (codeError) {
			tone = 'error';
			message = codeError;
			return;
		}

		if (!security) {
			tone = 'error';
			message = 'Security controls are not available right now.';
			return;
		}

		isVerifying = true;
		const result = await authRequest<StatusResponse>(security.routes.manage.verifyTotp, {
			method: 'POST',
			body: JSON.stringify({
				code: verificationCode
			})
		});
		isVerifying = false;

		if (!result.ok) {
			tone = 'error';
			message = getAuthErrorMessage(result, 'That two-factor code was not accepted.');
			return;
		}

		setupPassword = '';
		verificationCode = '';
		pendingTotpUri = '';
		latestBackupCodes = pendingBackupCodes;
		pendingBackupCodes = [];
		copiedBackupCodes = false;
		stage = 'backup';
		tone = 'success';
		message = 'Two-factor authentication is now enabled.';
		await refreshSecurityState();

		if (onSaved) {
			await onSaved(message);
		}
	};

	const regenerateBackupCodes = async (event: SubmitEvent) => {
		event.preventDefault();
		message = '';

		const passwordError = validateRequired(
			recoveryPassword,
			'Password is required to generate new backup codes.'
		);

		if (passwordError) {
			tone = 'error';
			message = passwordError;
			return;
		}

		if (!security) {
			tone = 'error';
			message = 'Security controls are not available right now.';
			return;
		}

		isRegenerating = true;
		const result = await authRequest<GenerateBackupCodesResponse>(
			security.routes.manage.generateBackupCodes,
			{
				method: 'POST',
				body: JSON.stringify({
					password: recoveryPassword
				})
			}
		);
		isRegenerating = false;

		if (!result.ok || !result.data) {
			tone = 'error';
			message = getAuthErrorMessage(result, 'We could not generate new backup codes.');
			return;
		}

		recoveryPassword = '';
		latestBackupCodes = result.data.backupCodes;
		copiedBackupCodes = false;
		stage = 'backup';
		tone = 'success';
		message = 'Your backup codes have been rotated.';
	};

	const disableTwoFactor = async (event: SubmitEvent) => {
		event.preventDefault();
		message = '';

		const passwordError = validateRequired(
			disablePassword,
			'Password is required to disable two-factor.'
		);

		if (passwordError) {
			tone = 'error';
			message = passwordError;
			return;
		}

		if (!security) {
			tone = 'error';
			message = 'Security controls are not available right now.';
			return;
		}

		isDisabling = true;
		const result = await authRequest<StatusResponse>(security.routes.manage.disable, {
			method: 'POST',
			body: JSON.stringify({
				password: disablePassword
			})
		});
		isDisabling = false;

		if (!result.ok) {
			tone = 'error';
			message = getAuthErrorMessage(result, 'We could not disable two-factor.');
			return;
		}

		disablePassword = '';
		latestBackupCodes = [];
		pendingTotpUri = '';
		pendingBackupCodes = [];
		stage = 'password';
		tone = 'success';
		message = 'Two-factor authentication has been disabled.';
		await refreshSecurityState();

		if (onSaved) {
			await onSaved(message);
		}
	};

	const clearTrustedDevices = async () => {
		message = '';

		if (!security) {
			tone = 'error';
			message = 'Security controls are not available right now.';
			return;
		}

		isClearingTrustedDevices = true;
		const result = await authRequest<StatusResponse>(security.routes.manage.clearTrustedDevices, {
			method: 'POST'
		});
		isClearingTrustedDevices = false;

		if (!result.ok) {
			tone = 'error';
			message = getAuthErrorMessage(result, 'We could not clear trusted devices.');
			return;
		}

		stage = 'manage';
		tone = 'success';
		message =
			'Trusted devices were cleared. Future sign-ins will require a fresh two-factor check.';
	};

	const copyBackupCodes = async () => {
		try {
			await navigator.clipboard.writeText(backupCodesText);
			copiedBackupCodes = true;
			tone = 'success';
			message = 'Backup codes copied.';
		} catch {
			tone = 'error';
			message = 'We could not copy the backup codes.';
		}
	};

	const downloadBackupCodes = () => {
		const blob = new Blob([backupCodesText], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'justsow-backup-codes.txt';
		anchor.click();
		URL.revokeObjectURL(url);
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[90svh] max-w-2xl overflow-y-auto rounded-xl p-0 sm:max-w-2xl">
		<div class="space-y-5 p-6">
			<Dialog.Header>
				<Dialog.Title>Two-factor authentication</Dialog.Title>
				<Dialog.Description
					>Use an authenticator app plus backup codes to secure your account.</Dialog.Description
				>
			</Dialog.Header>

			{#if security?.twoFactor.required}
				<p class="text-sm text-muted-foreground">
					Required for:
					<strong>{security.twoFactor.requiredForRoles.join(', ').replaceAll('_', ' ')}</strong>
				</p>
			{/if}

			{#if !security}
				<div
					class="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
				>
					<TriangleAlert class="mt-0.5 size-4 shrink-0" />
					<p>Security controls could not be loaded for this session.</p>
				</div>
			{:else if !security.twoFactor.enabled}
				{#if stage === 'password'}
					<form class="space-y-5" onsubmit={startSetup}>
						<div class="space-y-2">
							<Label for="two-factor-setup-password">Password</Label>
							<InputGroup.Root>
								<InputGroup.Input
									id="two-factor-setup-password"
									type={showSetupPassword ? 'text' : 'password'}
									bind:value={setupPassword}
									placeholder="Confirm your password to begin"
									required
								/>
								<InputGroup.Addon align="inline-end">
									<InputGroup.Button
										size="icon-xs"
										variant="ghost"
										aria-label={showSetupPassword ? 'Hide setup password' : 'Show setup password'}
										aria-pressed={showSetupPassword}
										class="rounded-full"
										onclick={() => (showSetupPassword = !showSetupPassword)}
									>
										{#if showSetupPassword}
											<EyeOff />
										{:else}
											<Eye />
										{/if}
									</InputGroup.Button>
								</InputGroup.Addon>
							</InputGroup.Root>
						</div>

						<Dialog.Footer class="px-0 pb-0">
							<Button type="button" variant="outline" onclick={() => (open = false)}>Close</Button>
							<Button type="submit" disabled={isEnabling}>
								<ShieldCheck />
								{isEnabling ? 'Preparing setup...' : 'Start setup'}
							</Button>
						</Dialog.Footer>
					</form>
				{:else if stage === 'authenticator'}
					<div class="space-y-5">
						<div class="space-y-1">
							<p class="text-sm font-semibold text-foreground">Step 1 of 3</p>
							<p class="text-sm text-muted-foreground">
								Scan the QR code with your authenticator app.
							</p>
						</div>

						<div class="flex justify-center">
							{#if qrCodeDataUrl}
								<img
									src={qrCodeDataUrl}
									alt="QR code for authenticator setup"
									class="size-52 rounded-lg border border-border/70 bg-card p-2"
								/>
							{:else}
								<div
									class="flex size-52 items-center justify-center rounded-lg border border-border/70 bg-card text-sm text-muted-foreground"
								>
									Preparing QR code...
								</div>
							{/if}
						</div>

						<p class="text-sm text-muted-foreground">
							Can’t scan it?
							<Button
								type="button"
								variant="link"
								class="h-auto px-0 py-0 text-sm"
								onclick={() => (showManualKey = !showManualKey)}
							>
								{showManualKey ? 'Hide manual key' : 'Show manual key'}
							</Button>
						</p>

						{#if showManualKey}
							<div class="space-y-1">
								<p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
									{setupLabel || 'Authenticator label'}
								</p>
								<p class="break-all font-mono text-sm text-foreground">{setupSecret}</p>
							</div>
						{/if}

						<Dialog.Footer class="px-0 pb-0">
							<Button type="button" variant="outline" onclick={() => (open = false)}>Close</Button>
							<Button type="button" onclick={() => (stage = 'verify')}>Continue</Button>
						</Dialog.Footer>
					</div>
				{:else if stage === 'verify'}
					<form class="space-y-4" onsubmit={finishSetup}>
						<div class="space-y-1">
							<p class="text-sm font-semibold text-foreground">Step 2 of 3</p>
							<p class="text-sm text-muted-foreground">
								Enter the 6-digit code from your authenticator app.
							</p>
						</div>

						<div class="space-y-1.5">
							<Label for="two-factor-verification-code">Verification code</Label>
							<InputOTP.Root
								id="two-factor-verification-code"
								bind:value={verificationCode}
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
						</div>

						<Dialog.Footer class="px-0 pb-0">
							<Button type="button" variant="outline" onclick={() => (stage = 'authenticator')}>
								Back
							</Button>
							<Button type="submit" disabled={isVerifying}>
								{isVerifying ? 'Verifying code...' : 'Verify and continue'}
							</Button>
						</Dialog.Footer>
					</form>
				{/if}
			{:else if stage === 'backup'}
				<div class="space-y-5">
					<div class="space-y-1">
						<p class="text-sm font-semibold text-foreground">Step 3 of 3</p>
						<p class="text-sm text-muted-foreground">
							Save these backup codes somewhere secure. Each code can be used once.
						</p>
					</div>

					<Textarea value={backupCodesText} readonly rows={8} class="font-mono text-sm" />

					<div class="flex flex-wrap gap-3">
						<Button type="button" variant="outline" onclick={copyBackupCodes}>
							<Copy />
							{copiedBackupCodes ? 'Copied' : 'Copy'}
						</Button>
						<Button type="button" variant="outline" onclick={downloadBackupCodes}>
							<Download />
							Download
						</Button>
					</div>

					<Dialog.Footer class="px-0 pb-0">
						<Button type="button" onclick={() => (stage = 'manage')}>I’ve saved these codes</Button>
					</Dialog.Footer>
				</div>
			{:else if stage === 'manage'}
				<div class="space-y-5">
					<p class="text-sm text-muted-foreground">
						Two-factor authentication is active on this account.
					</p>

					<div class="grid gap-3 sm:grid-cols-2">
						<Button
							type="button"
							variant="outline"
							class="w-full"
							onclick={() => (stage = 'regenerate')}
						>
							Generate new backup codes
						</Button>
						<Button
							type="button"
							variant="outline"
							class="w-full"
							onclick={() => (stage = 'trusted-devices')}
						>
							Clear trusted devices
						</Button>
					</div>

					<Dialog.Footer class="px-0 pb-0">
						<Button type="button" variant="outline" onclick={() => (open = false)}>Close</Button>
						<Button type="button" variant="destructive" onclick={() => (stage = 'disable')}>
							Disable
						</Button>
					</Dialog.Footer>
				</div>
			{:else if stage === 'regenerate'}
				<form class="space-y-5" onsubmit={regenerateBackupCodes}>
					<p class="text-sm text-muted-foreground">
						Enter your password to generate a new set of backup codes.
					</p>

					<div class="space-y-2">
						<Label for="backup-codes-password">Password</Label>
						<InputGroup.Root>
							<InputGroup.Input
								id="backup-codes-password"
								type={showRecoveryPassword ? 'text' : 'password'}
								bind:value={recoveryPassword}
								placeholder="Enter your password"
								required
							/>
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button
									size="icon-xs"
									variant="ghost"
									aria-label={showRecoveryPassword
										? 'Hide recovery password'
										: 'Show recovery password'}
									aria-pressed={showRecoveryPassword}
									class="rounded-full"
									onclick={() => (showRecoveryPassword = !showRecoveryPassword)}
								>
									{#if showRecoveryPassword}
										<EyeOff />
									{:else}
										<Eye />
									{/if}
								</InputGroup.Button>
							</InputGroup.Addon>
						</InputGroup.Root>
					</div>

					<Dialog.Footer class="px-0 pb-0">
						<Button type="button" variant="outline" onclick={() => (stage = 'manage')}>Back</Button>
						<Button type="submit" disabled={isRegenerating}>
							{isRegenerating ? 'Generating...' : 'Generate backup codes'}
						</Button>
					</Dialog.Footer>
				</form>
			{:else if stage === 'trusted-devices'}
				<div class="space-y-5">
					<div
						class="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground"
					>
						<SmartphoneNfc class="mt-0.5 size-4 shrink-0" />
						<p>
							Clearing trusted devices removes remembered two-factor trust so every device will need
							a fresh authenticator or backup-code check on the next sign-in.
						</p>
					</div>

					<Dialog.Footer class="px-0 pb-0">
						<Button type="button" variant="outline" onclick={() => (stage = 'manage')}>Back</Button>
						<Button type="button" disabled={isClearingTrustedDevices} onclick={clearTrustedDevices}>
							{isClearingTrustedDevices ? 'Clearing...' : 'Clear trusted devices'}
						</Button>
					</Dialog.Footer>
				</div>
			{:else if stage === 'disable'}
				<form class="space-y-5" onsubmit={disableTwoFactor}>
					<p class="text-sm text-muted-foreground">
						Enter your password to disable two-factor authentication.
					</p>

					<div class="space-y-2">
						<Label for="disable-two-factor-password">Password</Label>
						<InputGroup.Root>
							<InputGroup.Input
								id="disable-two-factor-password"
								type={showDisablePassword ? 'text' : 'password'}
								bind:value={disablePassword}
								placeholder="Enter your password"
								required
							/>
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button
									size="icon-xs"
									variant="ghost"
									aria-label={showDisablePassword
										? 'Hide disable password'
										: 'Show disable password'}
									aria-pressed={showDisablePassword}
									class="rounded-full"
									onclick={() => (showDisablePassword = !showDisablePassword)}
								>
									{#if showDisablePassword}
										<EyeOff />
									{:else}
										<Eye />
									{/if}
								</InputGroup.Button>
							</InputGroup.Addon>
						</InputGroup.Root>
					</div>

					<Dialog.Footer class="px-0 pb-0">
						<Button type="button" variant="outline" onclick={() => (stage = 'manage')}>Back</Button>
						<Button type="submit" variant="destructive" disabled={isDisabling}>
							{isDisabling ? 'Disabling...' : 'Disable'}
						</Button>
					</Dialog.Footer>
				</form>
			{/if}

			{#if message}
				<p class={`rounded-lg border px-4 py-3 text-sm ${messageClasses(tone)}`}>{message}</p>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
