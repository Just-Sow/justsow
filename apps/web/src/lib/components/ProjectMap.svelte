<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Map, Marker, Popup } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	type MapProject = {
		title: string;
		description: string;
		image: string;
		location: string;
		fundingRaised: number;
		fundingGoal: number;
		longitude: number;
		latitude: number;
	};

	let { projects, onFund }: { projects: MapProject[]; onFund: (project: MapProject) => void } =
		$props();

	let mapContainer: HTMLDivElement;
	let map: Map | undefined;
	let markers: Marker[] = [];
	let activePopup: Popup | undefined;
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

	const escapeHtml = (value: string) =>
		value.replace(
			/[&<>"']/g,
			(character) =>
				({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ??
				character
		);

	const getPopupMarkup = (project: MapProject) => `
		<div class="project-map-popup-card">
			<img class="project-map-popup-image" src="${project.image}" alt="" />
			<div class="project-map-popup-body">
				<p class="project-map-popup-eyebrow">${escapeHtml(project.location)}</p>
				<h3 class="project-map-popup-title">${escapeHtml(project.title)}</h3>
				<p class="project-map-popup-description">${escapeHtml(project.description)}</p>
				<div class="project-map-popup-progress">
					<div class="project-map-popup-progress-track"><span style="width: ${(project.fundingRaised / project.fundingGoal) * 100}%"></span></div>
					<span>${formatCurrency(getAmountLeft(project))} left</span>
				</div>
				<div class="project-map-popup-actions">
					<button type="button" class="project-map-popup-button project-map-popup-button-outline" data-action="view">View Project</button>
					<button type="button" class="project-map-popup-button project-map-popup-button-primary" data-action="fund">Fund Now</button>
				</div>
			</div>
		</div>
	`;

	const closePopupSoon = (popup: Popup, timeout?: ReturnType<typeof setTimeout>) => {
		if (timeout) clearTimeout(timeout);
		return setTimeout(() => popup.remove(), 140);
	};

	onMount(async () => {
		const maplibregl = await import('maplibre-gl');

		map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://openmaptiles.github.io/positron-gl-style/style-cdn.json',
			center: [135, -28],
			zoom: 3.35
		});
		map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

		map.on('load', () => {
			const currentMap = map;
			if (!currentMap) return;

			markers = projects.map((project) => {
				const markerElement = document.createElement('button');
				markerElement.type = 'button';
				markerElement.className = 'project-map-marker';
				markerElement.setAttribute('aria-label', `Show ${project.title}`);
				markerElement.innerHTML = `<img src="${project.image}" alt="" /><span></span>`;

				const popup = new maplibregl.Popup({
					closeButton: false,
					closeOnClick: false,
					offset: 30,
					maxWidth: '320px',
					className: 'project-map-popup'
				})
					.setLngLat([project.longitude, project.latitude])
					.setHTML(getPopupMarkup(project));

				let closeTimeout: ReturnType<typeof setTimeout> | undefined;
				let popupEventsAttached = false;
				const openPopup = () => {
					if (!map) return;
					if (closeTimeout) clearTimeout(closeTimeout);
					activePopup?.remove();
					activePopup = popup;
					popup.addTo(map);

					if (popupEventsAttached) return;
					popupEventsAttached = true;
					const popupElement = popup.getElement();
					if (!popupElement) return;

					popupElement.addEventListener('mouseenter', () => {
						if (closeTimeout) clearTimeout(closeTimeout);
					});
					popupElement.addEventListener('mouseleave', () => {
						closeTimeout = closePopupSoon(popup, closeTimeout);
					});
					popupElement
						.querySelector('[data-action="fund"]')
						?.addEventListener('click', () => onFund(project));
				};

				markerElement.addEventListener('mouseenter', openPopup);
				markerElement.addEventListener('focus', openPopup);
				markerElement.addEventListener('mouseleave', () => {
					closeTimeout = closePopupSoon(popup, closeTimeout);
				});
				markerElement.addEventListener('blur', () => popup.remove());

				return new maplibregl.Marker({ element: markerElement, anchor: 'bottom' })
					.setLngLat([project.longitude, project.latitude])
					.addTo(currentMap);
			});

			const longitudes = projects.map((project) => project.longitude);
			const latitudes = projects.map((project) => project.latitude);
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
		markers.forEach((marker) => marker.remove());
		map?.remove();
	});
</script>

<div class="project-map-shell">
	<div bind:this={mapContainer} class="project-map-canvas"></div>
	<div class="project-map-legend">
		<span class="project-map-legend-pin"></span>
		<span>Explore projects across Australia</span>
	</div>
</div>

<style>
	:global(.project-map-shell) {
		position: relative;
		height: min(680px, 72vh);
		min-height: 500px;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--muted);
		box-shadow: 0 12px 30px rgb(15 23 42 / 8%);
	}

	:global(.project-map-canvas) {
		position: absolute;
		inset: 0;
	}

	:global(.project-map-marker) {
		position: relative;
		display: flex;
		height: 52px;
		width: 52px;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border: 3px solid var(--background);
		border-radius: 999px 999px 999px 0;
		background: var(--primary);
		box-shadow: 0 4px 12px rgb(15 23 42 / 24%);
		transform: rotate(-45deg);
		transition:
			transform 150ms ease,
			box-shadow 150ms ease;
	}

	:global(.project-map-marker:hover),
	:global(.project-map-marker:focus-visible) {
		z-index: 2;
		box-shadow: 0 7px 18px rgb(15 23 42 / 30%);
		transform: rotate(-45deg) scale(1.08);
	}

	:global(.project-map-marker img) {
		height: 40px;
		width: 40px;
		border-radius: 999px;
		object-fit: cover;
		transform: rotate(45deg);
	}

	:global(.project-map-marker span) {
		position: absolute;
		bottom: -7px;
		left: 11px;
		height: 12px;
		width: 12px;
		border-radius: 999px;
		background: var(--secondary);
		border: 2px solid var(--background);
	}

	:global(.project-map-popup .maplibregl-popup-content) {
		padding: 0;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		box-shadow: 0 14px 34px rgb(15 23 42 / 18%);
	}

	:global(.project-map-popup .maplibregl-popup-tip) {
		border-top-color: var(--background);
	}

	:global(.project-map-popup-card) {
		width: 280px;
		overflow: hidden;
		border-radius: 0.75rem;
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

	:global(.project-map-popup-actions) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-top: 0.9rem;
	}

	:global(.project-map-popup-button) {
		cursor: pointer;
		border-radius: 0.35rem;
		padding: 0.5rem 0.4rem;
		font-size: 0.7rem;
		font-weight: 600;
	}

	:global(.project-map-popup-button-outline) {
		border: 1px solid var(--border);
		background: var(--background);
		color: var(--foreground);
	}

	:global(.project-map-popup-button-primary) {
		border: 1px solid var(--secondary);
		background: var(--secondary);
		color: var(--secondary-foreground);
	}

	:global(.project-map-legend) {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid var(--border);
		border-radius: 0.4rem;
		background: rgb(255 255 255 / 90%);
		padding: 0.5rem 0.7rem;
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--foreground);
		box-shadow: 0 4px 10px rgb(15 23 42 / 8%);
	}

	:global(.project-map-legend-pin) {
		height: 0.55rem;
		width: 0.55rem;
		border-radius: 999px;
		background: var(--secondary);
	}

	@media (max-width: 640px) {
		:global(.project-map-shell) {
			height: 68vh;
			min-height: 450px;
		}
	}
</style>
