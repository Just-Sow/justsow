<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import MdiSeedling from '~icons/mdi/seedling';
	import MdiWater from '~icons/mdi/water';
	import MdiSun from '~icons/mdi/weather-sunny';
	import MdiLightbulb from '~icons/mdi/lightbulb';
	import MdiHandshake from '~icons/mdi/handshake';
	import MdiTree from '~icons/mdi/tree';
</script>

<!-- Our Story -->
<section class="relative bg-amber-50 py-20">
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8"
	>
		<div>
			<h2 class="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">Our Story</h2>
			<p class="mb-6 border-l-4 border-primary pl-4 text-lg italic sm:text-xl">
				“A farmer went out to sow his seed. As he was scattering the seed, some fell along the path,
				and the birds came and ate it up. Some fell on rocky places, where it did not have much
				soil. It sprang up quickly, because the soil was shallow. But when the sun came up, the
				plants were scorched, and they withered because they had no root. Other seed fell among
				thorns, which grew up and choked the plants. Still other seed fell on good soil, where it
				produced a crop–a hundred, sixty or thirty times what was sown. Whoever has ears, let them
				hear.”<br />
				<span class="font-semibold">– Jesus, Matthew 13:1–9</span>
			</p>
			<p class="mb-4 text-lg">
				JustSow, inspired by Jesus’ teaching in the parable of the sower, believes that generous
				giving can help gospel seeds flourish. We see every creative evangelist as a modern-day
				sower, whose ideas and initiatives have the potential to grow far beyond their original
				planting. Yet, many of these bold, innovative projects struggle to get started—not for lack
				of vision, but for lack of support. JustSow exists to bridge that gap, providing the
				resources, encouragement, and mentorship needed to give these ideas fertile ground to take
				root.
				<br />
				<br />
				Our approach is simple but powerful: scatter resources widely, trusting God to bring growth. By
				supporting a wide range of projects—big or small, experimental or traditional—we multiply the
				impact of each investment for the Kingdom. Every seed grant, every piece of encouragement, and
				every act of collaboration contributes to a growing network of creative evangelists who are boldly
				sharing the gospel in new and transformative ways.
			</p>
		</div>

		<div class="relative">
			<img
				src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=687&auto=format&fit=crop"
				alt="Farmer sowing seeds"
				class="w-full rounded-2xl object-cover shadow-lg"
			/>
		</div>
	</div>
</section>

<!-- Our Purpose -->
<section class="bg-background py-20">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">Our Purpose</h2>
		<p class="mb-12 text-lg">
			We exist to fund bold, innovative evangelism projects that might otherwise struggle to get
			started.
		</p>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="flex flex-col items-center text-center">
				<MdiSeedling class="mb-4 h-12 w-12 text-primary" />
				<h3 class="mb-2 text-xl font-semibold">Seed Grants</h3>
				<p>£10,000 / $20,000 AUD (students £1,000 / $2,000 AUD)</p>
			</div>

			<div class="flex flex-col items-center text-center">
				<MdiWater class="mb-4 h-12 w-12 text-accent" />
				<h3 class="mb-2 text-xl font-semibold">Growth Opportunities</h3>
				<p>Second seed up to £50,000 / $100,000 AUD</p>
			</div>

			<div class="flex flex-col items-center text-center">
				<MdiSun class="mb-4 h-12 w-12 text-secondary" />
				<h3 class="mb-2 text-xl font-semibold">Wide Reach</h3>
				<p>Funding multiple projects to multiply impact</p>
			</div>
		</div>
	</div>
</section>

<!-- How We Work -->
<section class="bg-amber-50 py-20">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="mb-12 text-4xl font-bold sm:text-5xl lg:text-6xl">How We Work</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div class="flex flex-col items-center">
				<MdiLightbulb class="mb-2 h-12 w-12 text-primary" />
				<h3 class="mb-1 font-semibold">Submit Your Idea</h3>
				<p class="text-sm">Share your creative gospel project.</p>
			</div>

			<div class="flex flex-col items-center">
				<MdiHandshake class="mb-2 h-12 w-12 text-primary" />
				<h3 class="mb-1 font-semibold">Receive Seed Funding</h3>
				<p class="text-sm">Get initial support to get started.</p>
			</div>

			<div class="flex flex-col items-center">
				<MdiTree class="mb-2 h-12 w-12 text-primary" />
				<h3 class="mb-1 font-semibold">Grow Your Project</h3>
				<p class="text-sm">Develop for 12 months with support.</p>
			</div>

			<div class="flex flex-col items-center">
				<MdiSeedling class="mb-2 h-12 w-12 text-primary" />
				<h3 class="mb-1 font-semibold">Apply for Larger Seed</h3>
				<p class="text-sm">Multiply your impact for the Kingdom.</p>
			</div>
		</div>
	</div>
</section>

<!-- Our Vision -->
<section class="relative bg-white py-20">
	<div class="absolute inset-0">
		<img
			src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1470&auto=format&fit=crop"
			alt="Global mission map"
			class="h-full w-full object-cover brightness-40"
		/>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 text-center text-primary-foreground sm:px-6 lg:px-8">
		<h2 class="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">Our Vision</h2>
		<blockquote class="mb-6 text-lg italic sm:text-xl">
			“Whoever has ears, let them hear.”<br />
			<span class="font-semibold">–Jesus, Matthew 13:9</span>
		</blockquote>
		<p class="mx-auto mb-8 max-w-2xl text-lg">
			JustSow exists to support creative evangelists with the resources they need to reach more
			people. By funding innovative projects and multiplying impact, we aim to sow hope widely and
			bear lasting fruit for the Kingdom.
		</p>
		<Button size="lg" variant="secondary" href="/apply">Join the Movement / Apply Now</Button>
	</div>
</section>
