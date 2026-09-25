import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
	api: {
		projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id',
		dataset: process.env.SANITY_STUDIO_DATASET || 'production'
	},
	typegen: {
		path: '../web/src/**/*.{ts,svelte}',
		schema: '.sanity/schema.json',
		generates: '../web/src/lib/sanity/sanity.types.ts',
		overloadClientMethods: false
	}
});
