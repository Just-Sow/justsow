<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<footer class="border-t border-border/70 bg-primary text-primary-foreground">
	<!-- Main Footer Content -->
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Logo / Tagline -->
			<div class="flex flex-col items-center text-center md:items-start md:text-left">
				<h3 class="text-3xl font-bold tracking-tight">JustSow</h3>
				<p class="mt-3 max-w-xs text-sm/6 text-primary-foreground/85">
					Empowering creative evangelists to sow boldly and see gospel projects flourish.
				</p>
			</div>

			<!-- Navigation Links -->
			<div class="flex flex-col items-center text-center md:items-start md:text-left">
				<h4
					class="mb-3 text-sm font-semibold tracking-[0.18em] uppercase text-primary-foreground/70"
				>
					Explore
				</h4>
				<ul class="space-y-2">
					<li>
						<a href={resolve('/')} class="text-primary-foreground/90 hover:text-white">Home</a>
					</li>
					<li>
						<span class="text-primary-foreground/65">Projects</span>
					</li>
					<li>
						<a href={resolve('/about')} class="text-primary-foreground/90 hover:text-white">About</a
						>
					</li>
					<li>
						<a href={resolve('/contact')} class="text-primary-foreground/90 hover:text-white"
							>Contact</a
						>
					</li>
				</ul>
			</div>

			<!-- Social / Contact -->
			<div class="flex flex-col items-center space-y-3 text-center md:items-start md:text-left">
				<h4 class="text-sm font-semibold tracking-[0.18em] uppercase text-primary-foreground/70">
					Connect
				</h4>

				<!-- Email link -->
				<a
					href="mailto:info@justsow.org"
					class="inline-flex w-fit text-primary-foreground/90 transition-colors hover:text-white"
				>
					info@justsow.org
				</a>

				<!-- Social links -->
				<div class="flex flex-wrap justify-center gap-3 md:justify-start">
					<a
						href="https://www.instagram.com/officialjustsow/"
						target="_blank"
						rel="noreferrer"
						class="inline-flex w-fit text-primary-foreground/90 transition-colors hover:text-white"
					>
						Instagram
					</a>
					<a
						href="https://www.facebook.com/JustSowGiving/"
						target="_blank"
						rel="noreferrer"
						class="inline-flex w-fit text-primary-foreground/90 transition-colors hover:text-white"
					>
						Facebook
					</a>
					<a
						href="https://x.com/just_sow"
						target="_blank"
						rel="noreferrer"
						class="inline-flex w-fit text-primary-foreground/90 transition-colors hover:text-white"
					>
						X
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Regulatory / Legal Footer -->
	<div
		class="flex w-full flex-col gap-2 border-t border-white/10 bg-black/10 px-4 py-4 text-center text-sm text-primary-foreground/80 sm:px-6 md:flex-row md:justify-between md:text-left lg:px-8"
	>
		<!-- Left / Basic Info -->
		<div class="space-y-1 md:flex-1">
			<p>© Copyright 2025 JustSow.</p>
			<p>JustSow Terms, Conditions and Privacy</p>
		</div>

		<!-- Right / Regulatory Numbers -->
		<div class="space-y-1 md:flex-1 md:text-right">
			<p>JustSow Giving, Charity Number 1211941, CIO reg 20 January 2025</p>
			<p>
				Australian Company Number (ACN) 678 313 016. Australian Business Number (ABN) 49 678 313
				016. Reg date: 19th June 2024
			</p>
		</div>
	</div>
</footer>
