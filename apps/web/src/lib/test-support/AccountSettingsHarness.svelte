<script lang="ts">
	import { createAuthStore, setAuthStore } from '$lib/auth/store.js';
	import type { AuthViewer } from '$lib/auth/session.js';
	import AccountSettingsPage from '../../routes/account/settings/+page.svelte';

	type AccountSettingsPageData = {
		security: {
			twoFactor: {
				enabled: boolean;
				enabledAt: string | null;
			};
		} | null;
	};

	let {
		auth,
		data
	}: {
		auth: AuthViewer;
		data: AccountSettingsPageData;
	} = $props();

	const authStore = createAuthStore(null);

	setAuthStore(authStore);

	$effect(() => {
		authStore.set(auth);
	});
</script>

<AccountSettingsPage data={data as never} />
