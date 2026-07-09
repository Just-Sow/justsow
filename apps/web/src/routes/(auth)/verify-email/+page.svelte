<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import { authRequest } from '$lib/auth/client.js';
	import { Button } from '$lib/components/ui/button';

	type VerificationState = 'checking' | 'success' | 'error';

	let verificationState = $state('checking' as VerificationState);
	let message = $state('Verifying your email now...');
	let continueHref = $state('/login');

	const token = page.url.searchParams.get('token');
	const callbackURL = page.url.searchParams.get('callbackURL') || '/login';

	const verifyEmail = async () => {
		if (!token) {
			verificationState = 'error';
			message = 'That verification link is missing its token.';
			return;
		}

		const result = await authRequest<{ status: boolean }>(
			`/api/auth/verify-email?token=${encodeURIComponent(token)}&callbackURL=${encodeURIComponent(callbackURL)}`,
			{
				method: 'GET'
			}
		);

		if (!result.ok && result.status !== 200 && result.status !== 302) {
			verificationState = 'error';
			message = result.error?.message ?? 'This verification link could not be completed.';
			return;
		}

		verificationState = 'success';
		message =
			callbackURL === '/login'
				? 'Your email has been verified. You can now sign in.'
				: 'Your email has been verified.';
		continueHref = callbackURL;
	};

	onMount(() => {
		void verifyEmail();
	});
</script>

<AuthShell title="Email verification">
	<div class="flex flex-col space-y-5">
		<p
			class={`rounded-md border px-4 py-3 text-sm ${
				verificationState === 'error'
					? 'border-destructive/20 bg-destructive/5 text-destructive'
					: verificationState === 'success'
						? 'border-primary/20 bg-primary/5 text-foreground'
						: 'border-border bg-muted/40 text-muted-foreground'
			}`}
		>
			{message}
		</p>

		<Button href={continueHref}>
			{verificationState === 'success'
				? callbackURL === '/login'
					? 'Continue to login'
					: 'Continue'
				: 'Back to login'}
		</Button>
	</div>
</AuthShell>
