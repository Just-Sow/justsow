<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Map, Marker, Popup } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { buttonVariants } from '$lib/components/ui/button';
	import { ALMOST_DONE_THRESHOLD } from '$lib/project-discovery';
	import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

	type MapProject = {
		title: string;
		description: string;
		image: string;
		location: string;
		fundingRaised: number;
		fundingGoal: number;
		coordinates: readonly [longitude: number, latitude: number];
	};

	let {
		projects,
		onFund
	}: {
		projects: MapProject[];
		onFund: (project: MapProject) => void;
	} = $props();

	let mapContainer: HTMLDivElement;
	let map: Map | undefined;
	let markers: Marker[] = [];
	let activePopup: Popup | undefined;
	let activeMarkerElement: HTMLElement | undefined;
	let resizeObserver: ResizeObserver | undefined;

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat('en-AU', {
			style: 'currency',
			currency: 'AUD',
			maximumFractionDigits: 0
		})
			.format(value)
			.replace('A$', '$');

	const getAmountLeft = (project: MapProject) =>
		Math.max(project.fundingGoal - project.fundingRaised, 0);

	const isAlmostDone = (project: MapProject) => {
		const amountLeft = getAmountLeft(project);
		return amountLeft > 0 && amountLeft <= ALMOST_DONE_THRESHOLD;
	};

	const isValidCoordinates = ([longitude, latitude]: readonly [number, number]) =>
		Number.isFinite(longitude) &&
		Number.isFinite(latitude) &&
		longitude >= -180 &&
		longitude <= 180 &&
		latitude >= -90 &&
		latitude <= 90;

	const toLngLat = (coordinates: readonly [number, number]): [number, number] => [
		coordinates[0],
		coordinates[1]
	];

	const escapeHtml = (value: string) =>
		value.replace(
			/[&<>"']/g,
			(character) =>
				({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ??
				character
		);

	const createPopupCard = (project: MapProject) => {
		const card = document.createElement('article');
		card.className = 'project-map-popup-card';
		card.innerHTML = `
			<img class="project-map-popup-image" alt="" />
			<div class="project-map-popup-body">
				<p class="project-map-popup-eyebrow"></p>
				<h3 class="project-map-popup-title"></h3>
				<p class="project-map-popup-description"></p>
				<div class="project-map-popup-progress">
					<div class="project-map-popup-progress-track"><span></span></div>
					<span class="project-map-popup-amount-left"></span>
				</div>
				<div class="project-map-popup-actions">
					<button type="button" class="${buttonVariants({ variant: 'outline', size: 'sm' })}">View Project</button>
					<button type="button" class="${buttonVariants({ variant: 'default', size: 'sm' })}" data-action="fund">Fund Now</button>
				</div>
			</div>
		`;

		const image = card.querySelector<HTMLImageElement>('.project-map-popup-image');
		const eyebrow = card.querySelector<HTMLElement>('.project-map-popup-eyebrow');
		const title = card.querySelector<HTMLElement>('.project-map-popup-title');
		const description = card.querySelector<HTMLElement>('.project-map-popup-description');
		const progressTrack = card.querySelector<HTMLElement>('.project-map-popup-progress-track');
		const progress = card.querySelector<HTMLElement>('.project-map-popup-progress-track span');
		const amountLeft = card.querySelector<HTMLElement>('.project-map-popup-amount-left');
		const fundButton = card.querySelector<HTMLButtonElement>('[data-action="fund"]');

		if (image) {
			image.src = project.image;
		}
		if (eyebrow) eyebrow.textContent = project.location;
		if (title) title.textContent = project.title;
		if (description) description.textContent = project.description;
		if (progress) {
			progress.style.width = `${(project.fundingRaised / project.fundingGoal) * 100}%`;
			progress.classList.toggle('is-almost-done', isAlmostDone(project));
		}
		progressTrack?.classList.toggle('is-almost-done', isAlmostDone(project));
		if (amountLeft) amountLeft.textContent = `${formatCurrency(getAmountLeft(project))} left`;
		fundButton?.addEventListener('click', () => onFund(project));

		return card;
	};

	const showPopup = (
		project: MapProject,
		markerElement: HTMLElement,
		maplibregl: typeof import('maplibre-gl')
	) => {
		if (!map) return;

		activePopup?.remove();
		activeMarkerElement?.classList.remove('is-popup-open');
		markerElement.classList.add('is-popup-open');
		activeMarkerElement = markerElement;
		const popup = new maplibregl.Popup({
			closeButton: true,
			closeOnClick: true,
			closeOnMove: false,
			offset: 12,
			maxWidth: '320px',
			className: 'project-map-popup'
		})
			.setLngLat(toLngLat(project.coordinates))
			.setDOMContent(createPopupCard(project))
			.addTo(map);

		activePopup = popup;
		popup.on('close', () => {
			markerElement.classList.remove('is-popup-open');
			if (activeMarkerElement === markerElement) activeMarkerElement = undefined;
			if (activePopup === popup) activePopup = undefined;
		});
	};

	onMount(async () => {
		const maplibregl = await import('maplibre-gl');
		maplibregl.setWorkerUrl(maplibreWorkerUrl);

		map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://tiles.openfreemap.org/styles/positron',
			center: [135, -28],
			zoom: 3.35
		});
		map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

		map.on('load', () => {
			const currentMap = map;
			if (!currentMap) return;
			const mapProjects = projects.filter((project) => isValidCoordinates(project.coordinates));

			if (mapProjects.length !== projects.length) {
				console.warn(
					'Some projects were excluded from the map because their coordinates are invalid.'
				);
			}

			markers = mapProjects.map((project) => {
				const markerElement = document.createElement('div');
				markerElement.className = 'project-map-marker';
				markerElement.setAttribute('role', 'group');
				markerElement.innerHTML = `
					<button type="button" class="project-map-marker-shape" aria-label="Show ${escapeHtml(project.title)}">
						<img src="${project.image}" alt="" />
						${isAlmostDone(project) ? '<span class="project-map-marker-dot"></span>' : ''}
					</button>
				`;

				markerElement
					.querySelector('.project-map-marker-shape')
					?.addEventListener('click', (event) => {
						event.stopPropagation();
						showPopup(project, markerElement, maplibregl);
					});

				return new maplibregl.Marker({ element: markerElement, anchor: 'bottom', offset: [0, 0] })
					.setLngLat(toLngLat(project.coordinates))
					.addTo(currentMap);
			});

			if (mapProjects.length === 0) return;

			const longitudes = mapProjects.map((project) => project.coordinates[0]);
			const latitudes = mapProjects.map((project) => project.coordinates[1]);
			currentMap.fitBounds(
				[
					[Math.min(...longitudes), Math.min(...latitudes)],
					[Math.max(...longitudes), Math.max(...latitudes)]
				],
				{ padding: 70, maxZoom: 4.6, duration: 0 }
			);
		});

		resizeObserver = new ResizeObserver(() => map?.resize());
		resizeObserver.observe(mapContainer);
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
		activePopup?.remove();
		activeMarkerElement?.classList.remove('is-popup-open');
		markers.forEach((marker) => marker.remove());
		map?.remove();
	});
</script>

<div
	class="project-map-shell relative h-[min(680px,72vh)] min-h-[500px] overflow-hidden rounded-xl border border-transparent bg-muted shadow-lg max-sm:h-[68vh] max-sm:min-h-[450px]"
>
	<div
		bind:this={mapContainer}
		class="project-map-canvas absolute inset-0 overflow-hidden rounded-[inherit]"
	></div>
	<div
		class="project-map-legend absolute bottom-4 left-4 flex items-center gap-2 rounded-md border border-border bg-white/90 px-2.5 py-2 text-xs font-semibold text-foreground shadow-md"
	>
		<span class="size-[0.55rem] rounded-full bg-secondary"></span>
		<span>Explore projects across Australia</span>
	</div>
</div>

<style>
	:global(.project-map-shell)::after {
		position: absolute;
		inset: 0;
		z-index: 3;
		pointer-events: none;
		border: 1px solid var(--border);
		border-radius: inherit;
		content: '';
	}

	:global(.project-map-marker) {
		position: relative;
		display: block;
		height: 0;
		width: 0;
		cursor: pointer;
	}

	:global(.project-map-marker-shape) {
		position: absolute;
		top: -63px;
		left: -26px;
		display: flex;
		height: 52px;
		width: 52px;
		align-items: center;
		justify-content: center;
		border: 3px solid var(--background);
		border-radius: 999px 999px 999px 0;
		background: var(--primary);
		box-shadow: 0 4px 12px rgb(15 23 42 / 24%);
		transform: rotate(-45deg);
		transition:
			opacity 150ms ease,
			transform 150ms ease,
			box-shadow 150ms ease;
	}

	:global(.project-map-marker.is-popup-open .project-map-marker-shape) {
		opacity: 0;
		pointer-events: none;
	}

	:global(.project-map-marker:hover .project-map-marker-shape),
	:global(.project-map-marker:focus-visible .project-map-marker-shape) {
		z-index: 2;
		box-shadow: 0 7px 18px rgb(15 23 42 / 30%);
		transform: rotate(-45deg) scale(1.08);
	}

	:global(.project-map-marker-shape img) {
		height: 40px;
		width: 40px;
		border-radius: 999px;
		object-fit: cover;
		transform: rotate(45deg);
	}

	:global(.project-map-marker-dot) {
		position: absolute;
		bottom: -7px;
		left: 11px;
		height: 12px;
		width: 12px;
		border-radius: 999px;
		background: var(--secondary);
		border: 2px solid var(--background);
	}

	:global(.maplibregl-popup.project-map-popup .maplibregl-popup-content) {
		padding: 0;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--background);
		box-shadow: 0 14px 34px rgb(15 23 42 / 18%);
		animation: project-map-popup-rise 160ms ease-out both;
	}

	@keyframes project-map-popup-rise {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.94);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	:global(.project-map-popup .maplibregl-popup-tip) {
		border-top-color: var(--background);
	}

	:global(.project-map-popup-card) {
		width: 280px;
		overflow: hidden;
		border-radius: 0;
		background: var(--background);
		color: var(--foreground);
	}

	:global(.project-map-popup-image) {
		display: block;
		height: 112px;
		width: 100%;
		object-fit: cover;
	}

	:global(.project-map-popup-body) {
		padding: 0.9rem;
	}

	:global(.project-map-popup-eyebrow) {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	:global(.project-map-popup-title) {
		margin-top: 0.2rem;
		font-size: 1rem;
		font-weight: 700;
	}

	:global(.project-map-popup-description) {
		display: -webkit-box;
		margin-top: 0.35rem;
		overflow: hidden;
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--muted-foreground);
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	:global(.project-map-popup-progress) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.7rem;
		font-size: 0.68rem;
		color: var(--muted-foreground);
	}

	:global(.project-map-popup-progress-track) {
		height: 5px;
		flex: 1;
		overflow: hidden;
		border-radius: 999px;
		background: color-mix(in oklab, var(--primary) 15%, transparent);
	}

	:global(.project-map-popup-progress-track span) {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--primary);
	}

	:global(.project-map-popup-progress-track span.is-almost-done) {
		background: var(--secondary);
	}

	:global(.project-map-popup-progress-track.is-almost-done) {
		background: color-mix(in oklab, var(--secondary) 20%, transparent);
	}

	:global(.project-map-popup-actions) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-top: 0.9rem;
	}
</style>
