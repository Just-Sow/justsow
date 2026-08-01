<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, Flame, MapPin, ShoppingBasket, X } from '@lucide/svelte';
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
	import * as Popover from '$lib/components/ui/popover';
	import * as Sheet from '$lib/components/ui/sheet';

	type SeedbedItem = {
		projectTitle: string;
		amount: number;
	};

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
			description:
				'Running regional gatherings that combine food, music, and a clear gospel invitation.',
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
					description: 'Funds filming and editing for the opening set of testimony-led short films.'
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
					description:
						'Expands the format into more suburbs with shared resourcing and leadership support.'
				}
			]
		},
		{
			title: 'Waves of Worship',
			description:
				'Bringing acoustic worship gatherings to public spaces where faith can be heard openly.',
			image: guitarAtTheBeach,
			location: 'Perth, WA',
			fundingRaised: 14000,
			fundingGoal: 20000,
			milestones: [
				{
					amount: 5000,
					title: 'First beach set funded',
					description:
						'Covers permits, portable sound, and volunteer support for the first gathering.'
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

	const sowers = [
		{ name: 'Grace M.', initials: 'GM', colour: 'bg-primary/15 text-primary' },
		{ name: 'Nathan K.', initials: 'NK', colour: 'bg-secondary/15 text-secondary' },
		{ name: 'Leah T.', initials: 'LT', colour: 'bg-accent text-accent-foreground' }
	];

	const filters = [
		{ label: 'Featured', value: 'featured' },
		{ label: 'Under $10k left', value: 'under-10k' },
		{ label: 'Almost done', value: 'almost-done' },
		{ label: 'Fresh ideas', value: 'fresh' }
	] as const;

	type FilterValue = (typeof filters)[number]['value'];
	let activeFilter = $state<FilterValue>('featured');
	let amountSelections = $state<Record<string, number>>({});
	let seedbed = $state<SeedbedItem[]>([]);
	let seedbedOpen = $state(false);
	let fundNowOpen = $state(false);
	let selectedProject = $state<(typeof projects)[number] | null>(null);
	let addedProject = $state<string | null>(null);
	let milestoneHintVisible = $state(true);

	const seedbedStorageKey = 'justsow-demo-seedbed';
	const formatSowerLabel = (count: number) => `${count} other ${count === 1 ? 'sower' : 'sowers'}`;

	const getFilteredProjects = () => {
		switch (activeFilter) {
			case 'under-10k':
				return projects.filter(
					(project) => getAmountLeft(project.fundingRaised, project.fundingGoal) < 10000
				);
			case 'almost-done':
				return projects.filter((project) => isNearGoal(project.fundingRaised, project.fundingGoal));
			case 'fresh':
				return projects.filter((project) => project.fundingRaised <= 5000);
			default:
				return projects;
		}
	};

	const getNextMilestone = (project: (typeof projects)[number]) =>
		project.milestones.find((milestone) => milestone.amount > project.fundingRaised);

	const getMinimumSeedForNextMilestone = (project: (typeof projects)[number]) => {
		const nextMilestone = getNextMilestone(project);
		return nextMilestone ? nextMilestone.amount - project.fundingRaised : 0;
	};

	const reachesMilestone = (
		project: (typeof projects)[number],
		amount: number,
		milestoneAmount: number
	) => project.fundingRaised + amount >= milestoneAmount;

	const getSeedOptions = (project: (typeof projects)[number]) => {
		const amountRemaining = getAmountLeft(project.fundingRaised, project.fundingGoal);
		const standardAmounts = [1000, 2000, 3000, 5000, 10000, 15000, 20000];
		const options = standardAmounts.filter((amount) => amount <= amountRemaining);
		const maximumWholeThousand = Math.floor(amountRemaining / 1000) * 1000;

		if (maximumWholeThousand > 0 && !options.includes(maximumWholeThousand)) {
			options.push(maximumWholeThousand);
		}

		return options;
	};

	const getSelectedAmount = (project: (typeof projects)[number]) => {
		const nextMilestoneAmount = getMinimumSeedForNextMilestone(project);
		const defaultAmount = getSeedOptions(project).includes(nextMilestoneAmount)
			? nextMilestoneAmount
			: (getSeedOptions(project)[0] ?? 0);

		return amountSelections[project.title] ?? defaultAmount;
	};

	const getProjectImage = (title: string) =>
		projects.find((project) => project.title === title)?.image;

	const dismissMilestoneHint = (projectTitle: string, milestoneIndex: number) => {
		if (projectTitle === projects[0].title && milestoneIndex === 0) {
			milestoneHintVisible = false;
		}
	};

	const persistSeedbed = () => {
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.setItem(seedbedStorageKey, JSON.stringify(seedbed));
		}
	};

	const addToSeedbed = (project: (typeof projects)[number]) => {
		const amount = getSelectedAmount(project);
		if (!amount) return;

		seedbed = [
			...seedbed.filter((item) => item.projectTitle !== project.title),
			{ projectTitle: project.title, amount }
		];
		addedProject = project.title;
		persistSeedbed();
	};

	const removeFromSeedbed = (projectTitle: string) => {
		seedbed = seedbed.filter((item) => item.projectTitle !== projectTitle);
		persistSeedbed();
	};

	const clearSeedbed = () => {
		seedbed = [];
		persistSeedbed();
	};

	const seedbedTotal = $derived(seedbed.reduce((total, item) => total + item.amount, 0));

	onMount(() => {
		try {
			const storedSeedbed = sessionStorage.getItem(seedbedStorageKey);
			if (storedSeedbed) seedbed = JSON.parse(storedSeedbed) as SeedbedItem[];
		} catch {
			seedbed = [];
		}
	});

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

	const getAmountLeft = (raised: number, goal: number) => Math.max(goal - raised, 0);
	const isNearGoal = (raised: number, goal: number) => {
		const amountLeft = getAmountLeft(raised, goal);
		return amountLeft > 0 && amountLeft <= 5000;
	};
</script>

<!-- Hero -->
<section class="w-full bg-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-background))]">
	<div class="grid items-stretch lg:grid-cols-12">
		<div
			class="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:col-span-5 lg:px-14"
		>
			<div class="relative z-10">
				<p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
					Back bold gospel ideas
				</p>
				<h1 class="mt-4 max-w-xl text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">
					Creative ideas.
					<span class="block text-primary">Eternal impact.</span>
				</h1>

				<p class="mt-5 max-w-xl text-base leading-7 text-foreground/80 sm:text-lg">
					JustSow connects generous sowers with creative evangelists, helping new gospel projects
					move from first idea to public launch.
				</p>
			</div>
		</div>

		<div class="relative min-h-70 lg:col-span-7 lg:min-h-130">
			<div
				class="absolute inset-y-0 left-0 z-10 hidden w-72 bg-linear-to-r from-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-background))] via-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-background))]/82 to-transparent lg:block"
			></div>
			<div
				class="absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b from-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-background))] via-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-background))]/72 to-transparent lg:hidden"
			></div>
			<img
				src={successImages}
				alt="Supporters celebrating the success of a gospel project together"
				class="h-full w-full object-cover object-center"
			/>
		</div>
	</div>
</section>

<!-- Projects -->
<section class="mx-auto w-full max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
	<div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h3 class="mt-4 max-w-3xl text-lg font-semibold sm:text-xl lg:text-2xl">
				Partner with other Sowers to launch the next Gospel idea
			</h3>
			<div class="mt-3 h-1 w-16 bg-primary"></div>
		</div>

		<Popover.Root bind:open={seedbedOpen}>
			<Popover.Trigger
				class="relative inline-flex h-10 items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary shadow-xs outline-none transition-colors hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-primary/40"
				aria-label="Open Seedbed"
			>
				<ShoppingBasket class="size-4" />
				Seedbed
				{#if seedbed.length > 0}
					<span
						class="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground"
					>
						{seedbed.length}
					</span>
				{/if}
			</Popover.Trigger>

			<Popover.Content align="end" side="bottom" class="w-[min(24rem,calc(100vw-2rem))] p-0">
				<div class="flex items-center justify-between border-b border-border/70 px-5 py-4">
					<div>
						<p class="font-semibold">Your Seedbed</p>
						<p class="mt-1 text-xs text-muted-foreground">
							{seedbed.length === 0
								? 'Your saved seeds will appear here.'
								: `${seedbed.length} project${seedbed.length === 1 ? '' : 's'} ready to sow`}
						</p>
					</div>
					<Popover.Close
						class="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
						aria-label="Close Seedbed"
					>
						<X class="size-4" />
					</Popover.Close>
				</div>

				{#if seedbed.length === 0}
					<div class="px-5 py-8 text-center">
						<ShoppingBasket class="mx-auto size-8 text-primary/50" />
						<p class="mt-3 text-sm font-medium">A place for the projects you want to grow</p>
						<p class="mt-1 text-xs leading-5 text-muted-foreground">
							Choose Fund Now on a project to add your first seed.
						</p>
					</div>
				{:else}
					<div class="max-h-72 divide-y divide-border/70 overflow-y-auto px-5">
						{#each seedbed as item (item.projectTitle)}
							<div class="flex gap-3 py-4">
								<img
									src={getProjectImage(item.projectTitle)}
									alt=""
									class="size-12 rounded-md object-cover"
								/>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-semibold">{item.projectTitle}</p>
									<p class="mt-1 text-sm text-primary">{formatCurrency(item.amount)} seed</p>
								</div>
								<button
									type="button"
									class="self-start rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
									aria-label={`Remove ${item.projectTitle} from Seedbed`}
									onclick={() => removeFromSeedbed(item.projectTitle)}
								>
									<X class="size-4" />
								</button>
							</div>
						{/each}
					</div>
					<div class="border-t border-border/70 px-5 py-4">
						<div class="flex items-center justify-between text-sm">
							<span class="text-muted-foreground">Demo total</span>
							<span class="font-semibold">{formatCurrency(seedbedTotal)}</span>
						</div>
						<div class="mt-3 flex items-center justify-between gap-3">
							<button
								type="button"
								class="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
								onclick={clearSeedbed}
							>
								Clear Seedbed
							</button>
							<Button size="sm" onclick={() => (seedbedOpen = false)}>Review Seeds</Button>
						</div>
					</div>
				{/if}
			</Popover.Content>
		</Popover.Root>
	</div>

	<div class="mt-8 flex flex-wrap gap-2" aria-label="Filter featured projects">
		{#each filters as filter (filter.value)}
			<button
				type="button"
				class={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 ${activeFilter === filter.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}
				aria-pressed={activeFilter === filter.value}
				onclick={() => (activeFilter = filter.value)}
			>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Project Grid -->
	<div class="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		{#each getFilteredProjects() as project (project.title)}
			<Card.Root class="h-full pt-0 transition-shadow duration-300 hover:shadow-lg">
				<div class="flex h-full flex-col">
					<Card.Header class="relative p-0">
						<img src={project.image} alt={project.title} class="h-52 w-full object-cover" />
						<div
							class="absolute bottom-4 left-4 flex items-center gap-1 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm"
						>
							<MapPin />
							{project.location}
						</div>
					</Card.Header>
					<Card.Content class="mt-2 flex flex-1 flex-col">
						<h3 class="mb-2 text-xl font-semibold">{project.title}</h3>
						<p class="text-sm text-muted-foreground">{project.description}</p>
						<div class="mt-auto pt-4 space-y-3">
							<div class="flex items-center justify-between gap-3 text-xs text-muted-foreground">
								<div
									class={isNearGoal(project.fundingRaised, project.fundingGoal)
										? 'font-semibold text-secondary'
										: ''}
								>
									{formatCurrency(getAmountLeft(project.fundingRaised, project.fundingGoal))} left to
									raise
								</div>
								<div>{formatCurrency(project.fundingGoal)} goal</div>
							</div>

							<div
								class={`relative h-2 overflow-visible rounded-full ${isNearGoal(project.fundingRaised, project.fundingGoal) ? 'bg-secondary/20' : 'bg-primary/15'}`}
								role="progressbar"
								aria-label={`${project.title} funding progress`}
								aria-valuemin="0"
								aria-valuemax={project.fundingGoal}
								aria-valuenow={project.fundingRaised}
							>
								<div
									class={`h-full rounded-full transition-[width] duration-300 ease-out ${isNearGoal(project.fundingRaised, project.fundingGoal) ? 'bg-secondary' : 'bg-primary'}`}
									style={`width: ${(project.fundingRaised / project.fundingGoal) * 100}%`}
								></div>

								{#each project.milestones as milestone, milestoneIndex (milestone.amount)}
									<HoverCard.Root openDelay={100} closeDelay={50}>
										<HoverCard.Trigger
											class={`absolute top-1/2 z-10 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-background text-[10px] leading-none font-bold shadow-sm transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
												project.fundingRaised >= milestone.amount
													? isNearGoal(project.fundingRaised, project.fundingGoal)
														? 'border-secondary bg-secondary text-secondary-foreground'
														: 'border-primary bg-primary text-primary-foreground'
													: isNearGoal(project.fundingRaised, project.fundingGoal) &&
														  milestone.amount === project.fundingGoal
														? 'border-secondary text-transparent'
														: 'border-primary text-transparent'
											}`}
											style={`left: ${(milestone.amount / project.fundingGoal) * 100}%`}
											aria-label={`${project.title} milestone at ${formatCompactCurrency(milestone.amount)}`}
											onmouseenter={() => dismissMilestoneHint(project.title, milestoneIndex)}
										>
											{#if milestoneHintVisible && project.title === projects[0].title && milestoneIndex === 0}
												<span
													class="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-accent/70 bg-background px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-md before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-x-[5px] before:border-t-[5px] before:border-x-transparent before:border-t-accent/70 before:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-x-4 after:border-t-4 after:border-x-transparent after:border-t-background after:content-['']"
													aria-hidden="true"
												>
													Hover for details
												</span>
											{/if}
											{#if project.fundingRaised >= milestone.amount}
												<span>✓</span>
											{/if}
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

							<div class="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
								<div class="flex -space-x-2">
									{#each sowers as sower (sower.name)}
										<span
											class={`flex size-6 items-center justify-center rounded-full border-2 border-card text-[9px] font-bold ${sower.colour}`}
											title={sower.name}
										>
											{sower.initials}
										</span>
									{/each}
								</div>
								<span class="text-xs text-muted-foreground"
									>{formatSowerLabel(sowers.length)} are sowing here</span
								>
							</div>
						</div>
					</Card.Content>
				</div>
				<Card.Footer class="mt-auto mx-auto flex gap-4 text-center">
					<Button aria-label="Project details coming soon">View Project</Button>
					<button
						type="button"
						class="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs outline-none transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out hover:bg-[color-mix(in_oklab,var(--color-secondary)_92%,var(--color-foreground))] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring/50 active:translate-y-px"
						aria-label={`Fund ${project.title} now`}
						onclick={() => {
							selectedProject = project;
							fundNowOpen = true;
						}}
					>
						Fund Now
					</button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>

	<Sheet.Root bind:open={fundNowOpen}>
		<Sheet.Content side="right" class="w-full overflow-y-auto sm:max-w-md">
			{#if selectedProject}
				{@const project = selectedProject}
				{@const nextMilestone = getNextMilestone(project)}
				{@const minimumSeed = getMinimumSeedForNextMilestone(project)}
				<Sheet.Header class="border-b border-border/70 px-6 pb-5 pt-8">
					<div class="pr-8">
						<p class="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
							Fund a project
						</p>
						<Sheet.Title class="mt-1 text-xl font-semibold">{project.title}</Sheet.Title>
						<Sheet.Description class="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
							<MapPin class="size-3.5" />{project.location}
						</Sheet.Description>
					</div>
				</Sheet.Header>

				<div class="space-y-6 px-6 py-6">
					<img
						src={project.image}
						alt={project.title}
						class="h-44 w-full rounded-xl object-cover"
					/>
					<p class="text-sm leading-6 text-muted-foreground">{project.description}</p>

					<div class="rounded-xl border border-border/70 bg-muted/20 p-4">
						<div class="flex items-end justify-between gap-3">
							<div>
								<p class="text-xs font-medium text-muted-foreground">
									Funding progress with your seed
								</p>
								<p class="mt-1 text-2xl font-bold">
									{formatCurrency(project.fundingRaised + getSelectedAmount(project))}
								</p>
							</div>
							<p class="text-right text-xs text-muted-foreground">
								{formatCurrency(project.fundingRaised)} raised
								<span class="block text-secondary"
									>+ {formatCurrency(getSelectedAmount(project))} your seed</span
								>
							</p>
						</div>
						<div
							class="relative mt-5 h-3 overflow-visible rounded-full bg-primary/15"
							role="progressbar"
							aria-label={`${project.title} funding progress with selected seed`}
							aria-valuemin="0"
							aria-valuemax={project.fundingGoal}
							aria-valuenow={Math.min(
								project.fundingRaised + getSelectedAmount(project),
								project.fundingGoal
							)}
						>
							<div
								class="absolute inset-y-0 left-0 rounded-l-full bg-primary"
								style={`width: ${(project.fundingRaised / project.fundingGoal) * 100}%`}
							></div>
							<div
								class="absolute inset-y-0 rounded-r-full bg-secondary transition-[left,width] duration-200"
								style={`left: ${(project.fundingRaised / project.fundingGoal) * 100}%; width: ${Math.min((getSelectedAmount(project) / project.fundingGoal) * 100, ((project.fundingGoal - project.fundingRaised) / project.fundingGoal) * 100)}%`}
							></div>

							{#each project.milestones as milestone (milestone.amount)}
								<HoverCard.Root openDelay={100} closeDelay={50}>
									<HoverCard.Trigger
										class={`absolute top-1/2 z-10 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-background text-[10px] leading-none font-bold shadow-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${project.fundingRaised >= milestone.amount ? 'border-primary bg-primary text-primary-foreground' : reachesMilestone(project, getSelectedAmount(project), milestone.amount) ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-primary text-transparent'}`}
										style={`left: ${(milestone.amount / project.fundingGoal) * 100}%`}
										aria-label={`${project.title} milestone at ${formatCompactCurrency(milestone.amount)}`}
									>
										{#if project.fundingRaised >= milestone.amount || reachesMilestone(project, getSelectedAmount(project), milestone.amount)}
											<span>✓</span>
										{/if}
									</HoverCard.Trigger>
									<HoverCard.Content class="w-52">
										<div class="space-y-1.5">
											<p class="text-sm font-semibold text-foreground">{milestone.title}</p>
											<p class="text-xs text-muted-foreground">{milestone.description}</p>
											<p class="text-xs text-muted-foreground">
												{project.fundingRaised >= milestone.amount
													? `${formatCompactCurrency(milestone.amount)} milestone reached`
													: reachesMilestone(project, getSelectedAmount(project), milestone.amount)
														? `Your ${formatCompactCurrency(getSelectedAmount(project))} seed reaches this milestone`
														: `Unlocks at ${formatCompactCurrency(milestone.amount)}`}
											</p>
										</div>
									</HoverCard.Content>
								</HoverCard.Root>
							{/each}
						</div>

						<div class="relative mt-1 h-5 pt-1">
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
						{#if nextMilestone}
							<div class="mt-3 flex items-start justify-between gap-3 text-xs">
								<div class="min-w-0">
									<p class="font-semibold text-foreground">Next: {nextMilestone.title}</p>
									<p class="mt-0.5 truncate text-muted-foreground">{nextMilestone.description}</p>
								</div>
								<span
									class="shrink-0 rounded-full bg-accent px-2 py-1 font-semibold text-accent-foreground"
								>
									{formatCompactCurrency(nextMilestone.amount)}
								</span>
							</div>
						{/if}
					</div>

					<div>
						<p class="text-sm font-semibold">Choose your seed</p>
						<div class="mt-3 grid grid-cols-3 gap-2">
							{#each getSeedOptions(project) as amount (amount)}
								<button
									type="button"
									class={`flex min-h-12 flex-col items-center justify-center rounded-md border px-2 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 ${getSelectedAmount(project) === amount ? (nextMilestone && amount === minimumSeed ? 'border-2 border-secondary bg-secondary text-secondary-foreground' : 'border-primary bg-primary text-primary-foreground') : nextMilestone && amount === minimumSeed ? 'border-2 border-secondary bg-secondary/10 text-foreground hover:border-secondary' : 'border-border text-foreground hover:border-primary/60'}`}
									aria-pressed={getSelectedAmount(project) === amount}
									onclick={() => (amountSelections[project.title] = amount)}
								>
									<span class="flex items-center gap-1">
										{#if nextMilestone && amount === minimumSeed}<Flame class="size-3.5" />{/if}
										{formatCompactCurrency(amount)}
									</span>
									{#if nextMilestone && amount === minimumSeed}
										<span class="mt-0.5 text-[9px] font-semibold uppercase tracking-wide opacity-80"
											>Next milestone</span
										>
									{/if}
								</button>
							{/each}
						</div>
					</div>

					<div class="rounded-xl bg-primary/8 p-4">
						<div class="flex items-center gap-3">
							<div class="flex -space-x-2">
								{#each sowers as sower (sower.name)}
									<span
										class={`flex size-8 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold ${sower.colour}`}
										title={sower.name}
									>
										{sower.initials}
									</span>
								{/each}
							</div>
							<div>
								<p class="text-sm font-semibold">Join {formatSowerLabel(sowers.length)}</p>
								<p class="mt-1 text-xs text-muted-foreground">
									{sowers.map((sower) => sower.name).join(', ')} are already backing this idea.
								</p>
							</div>
						</div>
					</div>
				</div>

				<Sheet.Footer class="mt-auto border-t border-border/70 px-6 py-5">
					<div class="w-full space-y-3">
						<Button
							class="w-full"
							size="lg"
							variant="secondary"
							disabled={!getSelectedAmount(project)}
							onclick={() => addToSeedbed(project)}
						>
							{#if addedProject === project.title}<Check class="size-4" /> Added to Seedbed{:else}<ShoppingBasket
									class="size-4"
								/> Add {formatCurrency(getSelectedAmount(project))} to Seedbed{/if}
						</Button>
						<p class="text-center text-[11px] text-muted-foreground">
							Demo only — no payment or real allocation will happen.
						</p>
					</div>
				</Sheet.Footer>
			{/if}
		</Sheet.Content>
	</Sheet.Root>
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
