import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client.js';

const imageBuilder = createImageUrlBuilder(sanityClient);

export function sanityImageUrl(
	source: SanityImageSource | null | undefined,
	width: number,
	height?: number
) {
	if (!source) return undefined;
	const image = imageBuilder.image(source).width(width);
	if (height) image.height(height);
	return image.auto('format').url();
}
