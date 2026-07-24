<script lang="ts">
	import { MapPin } from '@lucide/svelte';
	import twelveApostlesPhotography from '$lib/assets/content/home/12-apostles-photography.png';
	import brewHope from '$lib/assets/content/home/brew-hope.png';
	import coffeeAtTheBeach from '$lib/assets/content/home/coffee-at-the-beach.png';
	import guitarAtTheBeach from '$lib/assets/content/home/guitar-at-the-beach.png';
	import largeBanquet from '$lib/assets/content/home/large-banquet.png';
	import successImages from '$lib/assets/content/home/success-images.png';
	import uluru from '$lib/assets/content/home/uluru.png';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as HoverCard from '$lib/components/ui/hover-card';

	const projects = [
		{
			title: 'Beach Conversations',
			description:
				'Creating space for natural, Christ-centred conversations with people already lingering by the water.',
			image: coffeeAtTheBeach,
			location: 'Gold Coast, QLD',
			fundingRaised: 5000,
			fundingGoal: 20000,
			milestones: [
				{
					amount: 10000,
					title: 'Conversation kits funded',
					description:
						'Covers coffee supplies, simple signage, and training prompts for the first volunteer team.'
				},
				{
					amount: 15000,
					title: 'Weekly beach rhythm launched',
					description:
						'Funds a repeatable presence with printed invites, follow-up resources, and team coordination.'
				},
				{
					amount: 20000,
					title: 'Coastal expansion ready',
					description:
						'Extends the model into more beaches with shared resourcing and volunteer support.'
				}
			]
		},
		{
			title: 'Hope on the Streets',
			description:
				'Launching a mobile coffee and chats van that offers hospitality, prayer, and gospel conversations.',
			image: brewHope,
			location: 'Melbourne, VIC',
			fundingRaised: 15000,
			fundingGoal: 20000,
			milestones: [
				{
					amount: 10000,
					title: 'Van fit-out started',
					description:
						'Covers the first stage of coffee equipment, signage, and practical setup for outreach nights.'
				},
				{
					amount: 15000,
					title: 'Street service launched',
					description:
						'Funds the first full run of coffee, volunteer support, and on-the-ground engagement materials.'
				},
				{
					amount: 20000,
					title: 'Multi-suburb route unlocked',
					description:
						'Extends the van into more locations with repeat visits and stronger follow-up pathways.'
				}
			]
		},
		{
			title: 'Outback Youth Nights',
			description: 'Running regional gatherings that combine food, music, and a clear gospel invitation.',
			image: uluru,
			location: 'Alice Springs, NT',
			fundingRaised: 12500,
			fundingGoal: 20000,
			milestones: [
				{
					amount: 7500,
					title: 'Pilot sessions funded',
					description: 'Launches the first workshop run with devices, trainers, and venue costs.'
				},
				{
					amount: 12500,
					title: 'Second cohort opened',
					description: 'Adds more seats and support materials for the next intake of students.'
				},
				{
					amount: 17500,
					title: 'Regional outreach expanded',
					description: 'Extends the program into partner communities outside the initial hub.'
				},
				{
					amount: 20000,
					title: 'Program fully funded',
					description: 'Covers the complete delivery plan and follow-up mentoring support.'
				}
			]
		},
		{
			title: 'Stories of Hope',
			description:
				'Making short gospel films and testimony stories that can travel online and open real conversations.',
			image: twelveApostlesPhotography,
			location: 'South-West, VIC',
			fundingRaised: 9000,
			fundingGoal: 20000,
			milestones: [
				{
					amount: 5000,
					title: 'Filmmaking kit funded',
					description:
						'Covers camera support, audio, lighting, and the basic gear needed for the first shoots.'
				},
				{
					amount: 10000,
					title: 'First gospel films produced',
					description:
						'Funds filming and editing for the opening set of testimony-led short films.'
				},
				{
					amount: 15000,
					title: 'Release campaign launched',
					description:
						'Adds subtitles, social cutdowns, and distribution support so the films can travel widely.'
				},
				{
					amount: 20000,
					title: 'Series fully commissioned',
					description:
						'Completes the full film slate with follow-up production, release support, and story capture.'
				}
			]
		},
		{
			title: 'Neighbourhood Table',
			description:
				'Hosting shared meals that create a warm space to ask life’s big questions around the table.',
			image: largeBanquet,
			location: 'Adelaide, SA',
			fundingRaised: 11000,
			fundingGoal: 20000,
			milestones: [
				{
					amount: 5000,
					title: 'Pilot dinners launched',
					description: 'Covers food, setup, and volunteer coordination for the first local meals.'
				},
				{
					amount: 10000,
					title: 'Monthly rhythm established',
					description:
						'Funds recurring dinners and simple invitations that welcome neighbours into honest conversation.'
				},
				{
					amount: 15000,
					title: 'Question-led evenings added',
					description:
						'Adds host training and table resources to help each meal open into deeper faith discussions.'
				},
				{
					amount: 20000,
					title: 'Multi-site table network',
					description: 'Expands the format into more suburbs with shared resourcing and leadership support.'
				}
			]
		},
		{
			title: 'Waves of Worship',
			description: 'Bringing acoustic worship gatherings to public spaces where faith can be heard openly.',
			image: guitarAtTheBeach,
			location: 'Perth, WA',
			fundingRaised: 14000,
			fundingGoal: 20000,
			milestones: [
				{
					amount: 5000,
					title: 'First beach set funded',
					description: 'Covers permits, portable sound, and volunteer support for the first gathering.'
				},
				{
					amount: 10000,
					title: 'Season schedule confirmed',
					description: 'Funds a series of worship nights with printed invites and team logistics.'
				},
				{
					amount: 15000,
					title: 'Recording and sharing unlocked',
					description: 'Adds live capture, social edits, and simple testimony integration.'
				},
				{
					amount: 20000,
					title: 'Regional worship trail launched',
					description: 'Extends the gatherings into a broader coastal run with partner churches.'
				}
			]
		}
	];

	const formatCompactCurrency = (value: number) => {
		if (value % 1000 === 0) {
			return `$${value / 1000}k`;
		}

		return `$${(value / 1000).toFixed(1)}k`;
	};

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat('en-AU', {
			style: 'currency',
			currency: 'AUD',
			maximumFractionDigits: 0
		})
			.format(value)
			.replace('A$', '$');
</script>

<!-- Hero -->
<section
	class="bg-linear-to-b
  from-background from-70%
  to-primary/50 py-16 text-center"
>
	<h1 class="text-4xl font-bold sm:text-5xl lg:text-6xl">
		Creative ideas.
		<br />
		<span class="text-primary">Eternal impact.</span>
	</h1>

	<p class="mt-4 text-lg">
		We connect generous sowers with bold evangelists, funding and growing creative gospel projects.
	</p>
</section>

<!-- Projects -->
<section class="mx-auto w-full max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
	<h3 class="mt-4 max-w-3xl text-lg font-semibold sm:text-xl lg:text-2xl">
		Partner with other Sowers to launch the next Gospel idea
	</h3>
	<div class="mt-3 h-1 w-16 bg-primary"></div>

	<!-- Project Grid -->
	<div class="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project (project.title)}
			<Card.Root class="pt-0 transition-shadow duration-300 hover:shadow-lg">
				<div class="block">
					<Card.Header class="relative p-0">
						<img src={project.image} alt={project.title} class="h-52 w-full object-cover" />
						<div
							class="absolute bottom-4 left-4 flex items-center gap-1 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm"
						>
							<MapPin />
							{project.location}
						</div>
					</Card.Header>
					<Card.Content class="mt-2">
						<h3 class="mb-2 text-xl font-semibold">{project.title}</h3>
						<p class="text-sm text-muted-foreground">{project.description}</p>
						<div class="mt-4 space-y-3">
							<div class="flex items-center justify-between gap-3 text-xs text-muted-foreground">
								<div>{formatCurrency(project.fundingRaised)} raised</div>
								<div>{formatCurrency(project.fundingGoal)} goal</div>
							</div>

							<div
								class="relative h-2 overflow-visible rounded-full bg-primary/15"
								role="progressbar"
								aria-label={`${project.title} funding progress`}
								aria-valuemin="0"
								aria-valuemax={project.fundingGoal}
								aria-valuenow={project.fundingRaised}
							>
								<div
									class="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
									style={`width: ${(project.fundingRaised / project.fundingGoal) * 100}%`}
								></div>

								{#each project.milestones as milestone (milestone.amount)}
									<HoverCard.Root openDelay={100} closeDelay={50}>
										<HoverCard.Trigger
											class="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
											style={`left: ${(milestone.amount / project.fundingGoal) * 100}%`}
										>
											<button
												type="button"
												class={`flex size-4 items-center justify-center rounded-full border-2 bg-background text-[10px] leading-none font-bold shadow-sm transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
													project.fundingRaised >= milestone.amount
														? 'border-primary bg-primary text-primary-foreground'
														: 'border-primary text-transparent'
												}`}
												aria-label={`${project.title} milestone at ${formatCompactCurrency(milestone.amount)}`}
											>
												{#if project.fundingRaised >= milestone.amount}
													<span>✓</span>
												{/if}
											</button>
										</HoverCard.Trigger>

										<HoverCard.Content class="w-52">
											<div class="space-y-1.5">
												<p class="text-sm font-semibold text-foreground">
													{milestone.title}
												</p>
												<p class="text-xs text-muted-foreground">
													{milestone.description}
												</p>
												<p class="text-xs text-muted-foreground">
													{project.fundingRaised >= milestone.amount
														? `${formatCompactCurrency(milestone.amount)} milestone reached`
														: `Unlocks at ${formatCompactCurrency(milestone.amount)}`}
												</p>
											</div>
										</HoverCard.Content>
									</HoverCard.Root>
								{/each}
							</div>

							<div class="relative h-5 pt-1">
								<div class="absolute top-0 left-0 text-[10px] font-medium text-muted-foreground">
									$0
								</div>
								{#each project.milestones as milestone (milestone.amount)}
									<div
										class="absolute top-0 -translate-x-1/2 text-[10px] font-medium text-muted-foreground"
										style={`left: ${(milestone.amount / project.fundingGoal) * 100}%`}
									>
										{formatCompactCurrency(milestone.amount)}
									</div>
								{/each}
							</div>
						</div>
					</Card.Content>
				</div>
				<Card.Footer class="mx-auto flex gap-4 text-center">
					<Button aria-label="Project details coming soon">View Project</Button>
					<Button variant="secondary" aria-label="Project details coming soon">Fund Now</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</section>

<!-- About -->
<section class="relative py-20">
	<div class="absolute inset-0">
		<img
			src="https://plus.unsplash.com/premium_photo-1661932971080-c6ec2a91f64c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt="Sowing Field"
			class="h-full w-full object-cover brightness-40"
		/>
	</div>

	<div
		class="relative mx-auto max-w-7xl px-4 text-center text-secondary-foreground sm:px-6 md:text-left lg:px-8"
	>
		<p class="mb-2 text-lg font-medium text-secondary">Inspired by the Sower’s story</p>
		<h2 class="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">Who We Are</h2>

		<blockquote class="mb-6 border-l-4 border-secondary pl-4 text-lg italic sm:text-xl">
			“A farmer went out to sow his seed… Some fell on good soil, where it produced a crop—a
			hundred, sixty or thirty times what was sown.”<br />
			<span class="font-semibold">— Matthew 13:3,8</span>
		</blockquote>

		<p class="mb-8 max-w-2xl">
			JustSow is shaped by Jesus’ teaching of the sower. We believe generous sowing—of money,
			creativity, and encouragement—can produce lasting gospel fruit. Our role is to empower
			creative evangelists, giving their ideas the soil they need to take root and multiply.
		</p>

		<Button size="lg" variant="secondary" href="/about">Learn More About Us</Button>
	</div>
</section>

<section class="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
	<!-- Evangelist -->
	<div class="flex flex-col items-center gap-8 md:flex-row md:gap-16">
		<div class="overflow-hidden rounded-2xl shadow-lg md:w-1/2">
			<img
				src="https://plus.unsplash.com/premium_photo-1661274033354-1847f286e957?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="Register Project"
				class="h-64 w-full object-cover md:h-full"
			/>
		</div>

		<div class="flex flex-col justify-center text-center md:w-1/2 md:text-right">
			<h4 class="text-xl font-medium text-muted-foreground">Have a vision to share?</h4>
			<h3 class="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
				Become an <span class="text-accent">Evangelist</span>
			</h3>
			<p class="mb-6 text-lg">
				Do you have a creative idea to share the gospel but lack the resources to start? JustSow
				exists to help innovators like you take bold first steps. With seed grants, mentoring, and
				growth opportunities, we’ll back your vision so it can flourish. Together, we can multiply
				your impact for the Kingdom.
			</p>
			<Button size="lg" variant="outline" class="mx-auto w-auto self-end md:mx-0"
				>Register Your Project</Button
			>
		</div>
	</div>

	<!-- Sower -->
	<div class="flex flex-col items-center gap-8 md:flex-row-reverse md:gap-16">
		<div class="overflow-hidden rounded-2xl shadow-lg md:w-1/2">
			<img
				src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="Become a Sower"
				class="h-64 w-full object-cover md:h-full"
			/>
		</div>

		<div class="flex flex-col justify-center text-center md:w-1/2 md:text-left">
			<h4 class="text text-xl font-medium text-muted-foreground">
				Want your giving to go further?
			</h4>
			<h3 class="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
				Become a <span class="text-accent">Sower</span>
			</h3>
			<p class="mb-6 text-lg">
				Your generosity can do more than meet needs—it can launch movements. By partnering with
				JustSow, you connect directly with evangelists who are ready to act but need support. Every
				gift is a seed that God can use to bear lasting fruit. Join us in sowing widely and watching
				the harvest grow.
			</p>
			<Button size="lg" variant="outline" class="mx-auto w-auto md:mx-0 md:self-start"
				>Support a Project</Button
			>
		</div>
	</div>
</section>

<!-- Vision -->
<section class="relative py-20">
	<div class="absolute inset-0">
		<img
			src="https://plus.unsplash.com/premium_photo-1681965550198-c1c039421905?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt="Community Growth"
			class="h-full w-full object-cover brightness-40"
		/>
	</div>

	<div
		class="relative mx-auto max-w-7xl px-4 text-center text-secondary-foreground sm:px-6 md:text-right lg:px-8"
	>
		<p class="mb-2 text-lg font-medium text-secondary">Sowing widely, reaping abundantly</p>
		<h2 class="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">Our Vision</h2>

		<blockquote class="mb-6 border-r-4 border-secondary pr-4 text-lg italic sm:text-xl">
			“Whoever has ears, let them hear.”<br />
			<span class="font-semibold">— Matthew 13:9</span>
		</blockquote>

		<p class="mb-8 max-w-2xl md:ml-auto">
			Our vision is simple: to see the gospel proclaimed boldly across nations. Many bold ideas
			struggle without support—so we provide the seed that helps them grow. By funding and
			encouraging evangelists, we multiply mission and reach more people with the hope of Christ.
		</p>

		<Button size="lg" variant="secondary" href="/about">Discover our Vision</Button>
	</div>
</section>
