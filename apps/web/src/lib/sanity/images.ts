import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client.js';

const imageBuilder = createImageUrlBuilder(sanityClient);

export function sanityImageUrl(source: SanityImageSource | null | undefined, width: number) {
	if (!source) return undefined;
	return imageBuilder.image(source).width(width).auto('format').url();
}
