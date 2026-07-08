<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import MdiMapMarker from '~icons/mdi/map-marker';

	const projects = [
		{
			title: 'Music for Change',
			description: 'Funding music programs for underprivileged youth to inspire creativity.',
			image:
				'https://images.unsplash.com/photo-1697197603033-df2940b7f22e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			location: 'AUS'
		},
		{
			title: 'Urban Art Project',
			description: 'Transforming city walls into vibrant art to empower local artists.',
			image:
				'https://images.unsplash.com/photo-1697197603033-df2940b7f22e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			location: 'UK'
		},
		{
			title: 'Tech for Good',
			description: 'Providing affordable tech workshops to bridge the digital divide.',
			image:
				'https://images.unsplash.com/photo-1697197603033-df2940b7f22e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			location: 'UK'
		}
	];
</script>

<!-- Hero -->
<section
	class="bg-linear-to-b
  from-background from-70%
  to-primary/50 py-16 text-center"
>
	<h1 class="text-4xl font-bold sm:text-5xl lg:text-6xl">
		Plant the <span class="text-primary">Seed</span>
		<br />
		Transform the
		<span class="text-primary">World</span>
	</h1>

	<p class="mt-4 text-lg">
		We connect generous sowers with bold evangelists, funding and growing creative gospel projects.
	</p>

	<div class="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
		<div class="text-center">
			<p class="text-4xl font-extrabold text-primary">21</p>
			<p class="mt-2 text-lg font-medium">Projects Seeking Funding</p>
		</div>
		<div class="text-center">
			<p class="text-4xl font-extrabold text-primary">10</p>
			<p class="mt-2 text-lg font-medium">Seeds Available for Projects</p>
		</div>
	</div>
	<div class="mt-10 space-x-4">
		<Button size="lg" variant="secondary">Add Your Project</Button>
		<Button variant="outline" size="lg">Become a Sower</Button>
	</div>
</section>

<!-- Projects -->
<section class="mx-auto w-full max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
	<h2 class="text-3xl font-bold sm:text-4xl lg:text-5xl">
		Featured <span class="text-primary">Projects</span>
	</h2>
	<p class="mt-4 text-lg">
		Explore some of the inspiring projects funded and growing through our community.
	</p>

	<!-- Project Grid -->
	<div class="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project (project.title)}
			<Card.Root class="pt-0 transition-shadow duration-300 hover:shadow-lg">
				<a href={`/project/${project.title.replace(/\s+/g, '-').toLowerCase()}`} class="block">
					<Card.Header class="relative p-0">
						<img
							src={project.image}
							alt={project.title}
							class="h-64 w-full rounded-t-2xl object-cover"
						/>
						<div
							class="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
						>
							<MdiMapMarker />
							{project.location}
						</div>
					</Card.Header>
					<Card.Content class="mt-2">
						<h3 class="mb-2 text-xl font-semibold">{project.title}</h3>
						<p class="text-sm text-muted-foreground">{project.description}</p>
					</Card.Content>
				</a>
				<Card.Footer class="mx-auto">
					<Button size="sm" href={`/project/${project.title.replace(/\s+/g, '-').toLowerCase()}`}
						>Learn More</Button
					>
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
