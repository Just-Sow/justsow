<script lang="ts">
	import AuthShell from '$lib/components/auth/AuthShell.svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<AuthShell
	eyebrow="Your Account"
	title="Account settings"
	description="This is where profile, password, email verification, and two-factor controls will live."
>
	<Card.Header class="space-y-2">
		<Card.Title>Settings are coming next</Card.Title>
		<Card.Description>
			The navigation entry is in place so the authenticated account area has a stable destination while we
			build the rest of the settings UI.
		</Card.Description>
	</Card.Header>

	<Card.Content class="pb-6">
		<div class="rounded-lg border border-border/70 bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
			Account management will be implemented here in the next UI pass.
		</div>
	</Card.Content>
</AuthShell>
