<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import MdiEmail from '~icons/mdi/email';
	import MdiPhone from '~icons/mdi/phone';
</script>

<!-- Contact Page -->
<section class="relative bg-amber-50 py-20">
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8"
	>
		<div>
			<h2 class="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">Get in Touch</h2>
			<p class="mb-6 text-lg">
				We’d love to hear from you! Whether you have questions about applying for a seed grant, want
				to share a new idea, or just want to connect, you can reach us using the form below or via
				our contact info.
			</p>

			<div class="grid grid-cols-1 gap-4 text-lg">
				<div class="flex items-center space-x-3">
					<MdiEmail class="h-6 w-6 text-primary" />
					<span>info@justsow.org</span>
				</div>
				<div class="flex items-center space-x-3">
					<MdiPhone class="h-6 w-6 text-primary" />
					<span>+0 000 000 000</span>
				</div>
			</div>
		</div>

		<div>
			<Card.Root class="rounded-2xl bg-white p-8 shadow-lg">
				<h3 class="mb-6 text-2xl font-semibold">Send a Message</h3>
				<form class="space-y-4" method="POST" action="/api/contact">
					<div>
						<label class="mb-1 block font-medium" for="name">Name</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary"
						/>
					</div>
					<div>
						<label class="mb-1 block font-medium" for="email">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary"
						/>
					</div>
					<div>
						<label class="mb-1 block font-medium" for="message">Message</label>
						<textarea
							id="message"
							name="message"
							rows="5"
							required
							class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary"
						></textarea>
					</div>
					<Button type="submit" size="lg" class="mt-2 w-full">Send Message</Button>
				</form>
			</Card.Root>
		</div>
	</div>
</section>

<!-- Optional Map / Background Image -->
<section class="relative py-20">
	<img
		src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1470&auto=format&fit=crop"
		alt="Global mission map"
		class="absolute inset-0 h-full w-full object-cover brightness-40"
	/>
	<div class="relative mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
		<h2 class="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">Join Our Mission</h2>
		<p class="mx-auto mb-8 max-w-2xl text-lg">
			We’re always looking to connect with creative evangelists, supporters, and friends of JustSow.
			Reach out and help us scatter seeds of hope across the nations.
		</p>
		<Button size="lg" variant="secondary" href="/apply">Apply for a Seed Grant</Button>
	</div>
</section>
