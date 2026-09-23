import { DocumentIcon } from '@sanity/icons/Document';
import { LinkIcon } from '@sanity/icons/Link';
import { visionTool } from '@sanity/vision';
import { defineConfig, isDev } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schema-types';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

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
		...(isDev ? [visionTool()] : [])
	],
	schema: {
		types: schemaTypes
	}
});
