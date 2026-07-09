<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import MdiMenu from '~icons/mdi/menu';
	import MdiClose from '~icons/mdi/close';

	let open = false;
</script>

<header class="sticky top-0 z-50 hidden w-full bg-background shadow-lg md:block">
	<div class="relative container mx-auto flex h-20 items-center justify-between px-4">
		<a href="/" class="z-10 flex items-center gap-2">
			<img src={logo} alt="MyApp Logo" class="h-12 w-auto" />
		</a>

		<nav class="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 gap-6 md:flex">
			<a href="/" class="text-sm font-medium transition-colors hover:text-primary">Home</a>
			<a href="/about" class="text-sm font-medium transition-colors hover:text-primary">About</a>
			<a href="/contact" class="text-sm font-medium transition-colors hover:text-primary">Contact</a
			>
		</nav>

		<div class="z-10 flex items-center gap-2">
			<Button size="sm" variant="outline" href="/login">Login</Button>
			<Button size="sm" href="/signup">Sign Up</Button>
		</div>
	</div>
</header>

<header
	class="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-background px-4 shadow-lg md:hidden"
>
	<Popover.Root bind:open>
		<Popover.Trigger>
			<button class="flex items-center gap-2 p-2">
				{#if open}
					<MdiClose class="h-6 w-6" />
				{:else}
					<MdiMenu class="h-6 w-6" />
				{/if}
				<span class="text-lg font-medium">Menu</span>
			</button>
		</Popover.Trigger>

		<Popover.Content
			class="flex w-(--bits-popover-content-available-width) max-w-none flex-col gap-8 bg-background/95 p-6"
		>
			<nav class="flex flex-col gap-6 text-left">
				<a href="/" class="text-2xl font-semibold hover:text-primary">Home</a>
				<a href="/about" class="text-2xl font-semibold hover:text-primary">About</a>
				<a href="/contact" class="text-2xl font-semibold hover:text-primary">Contact</a>
			</nav>

			<div class="mt-8 flex justify-center gap-4">
				<Button size="sm" variant="outline" href="/login">Login</Button>
				<Button size="sm" href="/signup">Sign Up</Button>
			</div>
		</Popover.Content>
	</Popover.Root>

	<a href="/" class="flex items-center gap-2">
		<img src={logo} alt="MyApp Logo" class="h-10 w-auto" />
	</a>
</header>
