<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ChevronDown, LogOut, Menu, Settings, UserRound, X } from '@lucide/svelte';
	import { authRequest } from '$lib/auth/client.js';
	import { getAuthStore } from '$lib/auth/store.js';
	import logo from '$lib/assets/logo.svg';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';

	const auth = getAuthStore();
	let open = $state(false);
	let accountOpen = $state(false);
	let isSigningOut = $state(false);
	const isAuthenticated = $derived(!!$auth?.user);
	const displayName = $derived($auth?.user.firstName?.trim().split(/\s+/)[0] || 'there');
	const email = $derived($auth?.user.email || '');

	const signOut = async () => {
		isSigningOut = true;

		const result = await authRequest('/api/auth/sign-out', {
			method: 'POST'
		});

		isSigningOut = false;

		if (!result.ok) {
			return;
		}

		open = false;
		accountOpen = false;
		await invalidateAll();
		await goto(resolve('/'));
	};
</script>

<header
	class="sticky top-0 z-50 hidden w-full border-b border-border/70 bg-background/95 backdrop-blur md:block"
>
	<div class="relative container mx-auto flex h-20 items-center justify-between px-4">
		<a href={resolve('/')} class="z-10 flex items-center gap-2">
			<img src={logo} alt="MyApp Logo" class="h-12 w-auto" />
		</a>

		<nav class="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 gap-6 md:flex">
			<a href={resolve('/')} class="text-sm font-medium text-foreground/80 hover:text-primary"
				>Home</a
			>
			<a href={resolve('/about')} class="text-sm font-medium text-foreground/80 hover:text-primary"
				>About</a
			>
			<a
				href={resolve('/contact')}
				class="text-sm font-medium text-foreground/80 hover:text-primary">Contact</a
			>
		</nav>

		<div class="z-10 flex items-center gap-3">
			{#if isAuthenticated}
				<Popover.Root bind:open={accountOpen}>
					<Popover.Trigger>
						<Button
							type="button"
							variant="ghost"
							class="gap-3 text-foreground/85"
							aria-label="Open account menu"
						>
							<UserRound class="size-4 text-foreground/85" />
							<span>{displayName}</span>
							<ChevronDown
								strokeWidth={2.5}
								class={`size-4 text-foreground/85 transition-transform duration-200 ${accountOpen ? 'rotate-180' : 'rotate-0'}`}
							/>
						</Button>
					</Popover.Trigger>

					<Popover.Content align="end" class="w-72 p-2">
						<div class="rounded-md px-3 py-3">
							<p class="text-sm font-semibold text-foreground">My Profile</p>
							<p class="mt-1 text-sm text-muted-foreground">{email}</p>
						</div>

						<div class="mt-1 border-t border-border/70 pt-1">
							<a
								href={resolve('/account/settings')}
								class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/60 hover:text-foreground"
								onclick={() => (accountOpen = false)}
							>
								<Settings class="size-4" />
								<span>Account settings</span>
							</a>

							<Button
								type="button"
								variant="ghost"
								class="w-full justify-start px-3 text-foreground/80 hover:bg-muted/60 hover:text-foreground"
								onclick={signOut}
								disabled={isSigningOut}
							>
								<LogOut class="size-4" />
								<span>{isSigningOut ? 'Logging out...' : 'Log out'}</span>
							</Button>
						</div>
					</Popover.Content>
				</Popover.Root>
			{:else}
				<Button size="sm" variant="outline" href="/login">Login</Button>
				<Button size="sm" href="/signup">Sign Up</Button>
			{/if}
		</div>
	</div>
</header>

<header
	class="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur md:hidden"
>
	<Popover.Root bind:open>
		<Popover.Trigger>
			<Button variant="ghost" class="gap-2 px-2 text-foreground/85">
				{#if open}
					<X class="h-6 w-6" />
				{:else}
					<Menu class="h-6 w-6" />
				{/if}
				<span class="text-lg font-medium">Menu</span>
			</Button>
		</Popover.Trigger>

		<Popover.Content
			class="flex w-(--bits-popover-content-available-width) max-w-none flex-col gap-8 border border-border/70 bg-background/95 p-6 shadow-lg"
		>
			<nav class="flex flex-col gap-6 text-left">
				<a href={resolve('/')} class="text-2xl font-semibold text-foreground/85 hover:text-primary"
					>Home</a
				>
				<a
					href={resolve('/about')}
					class="text-2xl font-semibold text-foreground/85 hover:text-primary">About</a
				>
				<a
					href={resolve('/contact')}
					class="text-2xl font-semibold text-foreground/85 hover:text-primary">Contact</a
				>
			</nav>

			<div class="mt-8 flex flex-col items-center gap-4">
				{#if isAuthenticated}
					<div class="w-full rounded-xl border border-border/70 bg-muted/20 p-4 text-left">
						<div class="flex items-center gap-3">
							<span
								class="flex size-10 items-center justify-center rounded-full bg-muted text-foreground/70"
							>
								<UserRound class="size-5" />
							</span>
							<div class="min-w-0">
								<p class="text-sm font-semibold text-foreground">My Profile</p>
								<p class="truncate text-sm text-muted-foreground">{email}</p>
							</div>
						</div>

						<div class="mt-4 flex flex-col gap-1 border-t border-border/70 pt-3">
							<a
								href={resolve('/account/settings')}
								class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/60 hover:text-foreground"
								onclick={() => (open = false)}
							>
								<Settings class="size-4" />
								<span>Account settings</span>
							</a>

							<Button
								type="button"
								variant="ghost"
								class="w-full justify-start px-3 text-foreground/80 hover:bg-muted/60 hover:text-foreground"
								onclick={signOut}
								disabled={isSigningOut}
							>
								<LogOut class="size-4" />
								<span>{isSigningOut ? 'Logging out...' : 'Log out'}</span>
							</Button>
						</div>
					</div>
				{:else}
					<div class="flex justify-center gap-4">
						<Button size="sm" variant="outline" href="/login">Login</Button>
						<Button size="sm" href="/signup">Sign Up</Button>
					</div>
				{/if}
			</div>
		</Popover.Content>
	</Popover.Root>

	<a href={resolve('/')} class="flex items-center gap-2">
		<img src={logo} alt="MyApp Logo" class="h-10 w-auto" />
	</a>
</header>
