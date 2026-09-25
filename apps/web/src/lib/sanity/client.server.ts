import { env } from '$env/dynamic/private';
import { sanityClient } from './client.js';

export const sanityServerClient = sanityClient.withConfig({
	token: env.SANITY_VIEWER_TOKEN
});
