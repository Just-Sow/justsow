import { DocumentIcon } from '@sanity/icons/Document';
import { DocumentsIcon } from '@sanity/icons/Documents';
import { HomeIcon } from '@sanity/icons/Home';
import { LinkIcon } from '@sanity/icons/Link';
import { lucideIconPicker } from '@kodamera/sanity-plugin-lucide-icon-picker';
import { visionTool } from '@sanity/vision';
import { defineConfig, isDev } from 'sanity';
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schema-types';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const pageDocuments = defineDocuments([
	{ route: '/', filter: '_type == "homePage"' },
	{ route: '/contact', filter: '_type == "contactPage"' },
	{
		route: '/:slug',
		filter: '_type == "page" && slug.current == $slug'
	}
]);
const pageLocations = {
	homePage: defineLocations({
		select: {},
		resolve: () => ({ locations: [{ title: 'Home page', href: '/' }] })
	}),
	contactPage: defineLocations({
		select: {},
		resolve: () => ({ locations: [{ title: 'Contact page', href: '/contact' }] })
	}),
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
		lucideIconPicker(),
		structureTool({
			structure: (S) =>
				S.list()
					.title('Content')
					.items([
						S.listItem()
							.id('home-page')
							.title('Home page')
							.icon(HomeIcon)
							.child(S.document().schemaType('homePage').documentId('homePage').title('Home page')),
						S.listItem()
							.id('contact-page')
							.title('Contact page')
							.icon(DocumentIcon)
							.child(
								S.document()
									.schemaType('contactPage')
									.documentId('contactPage')
									.title('Contact page')
							),
						S.documentTypeListItem('page').title('Static Pages').icon(DocumentsIcon),
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
					enable: '/preview/enable',
					disable: '/preview/disable'
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
