import { DocumentIcon } from '@sanity/icons/Document';
import { LinkIcon } from '@sanity/icons/Link';
import { visionTool } from '@sanity/vision';
import { defineConfig, isDev } from 'sanity';
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schema-types';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const pageDocuments = defineDocuments([
	{
		route: '/:slug',
		filter: '_type == "page" && slug.current == $slug'
	}
]);
const pageLocations = {
	page: defineLocations({
		select: {
			title: 'title',
			slug: 'slug.current'
		},
		resolve: (document) => ({
			locations: document?.slug
				? [{ title: document.title || 'Untitled page', href: `/${document.slug}` }]
				: []
		})
	})
};

export default defineConfig({
	name: 'justsow',
	title: 'JustSow',
	projectId,
	dataset,
	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title('Content')
					.items([
						S.documentTypeListItem('page').title('Pages').icon(DocumentIcon),
						S.listItem()
							.id('site-navigation')
							.title('Site navigation')
							.icon(LinkIcon)
							.child(
								S.document()
									.schemaType('siteNavigation')
									.documentId('siteNavigation')
									.title('Site navigation')
							)
					])
		}),
		...(isDev ? [visionTool()] : []),
		presentationTool({
			previewUrl: {
				initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://127.0.0.1:5173',
				previewMode: {
					enable: '/preview/enable'
				}
			},
			resolve: {
				mainDocuments: pageDocuments,
				locations: pageLocations
			}
		})
	],
	schema: {
		types: schemaTypes
	}
});
