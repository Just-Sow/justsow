import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const contactPage = defineType({
	name: 'contactPage',
	title: 'Contact page',
	type: 'document',
	icon: DocumentIcon,
	fields: [
		defineField({
			name: 'seo',
			title: 'Search and social metadata',
			type: 'object',
			fields: [
				defineField({
					name: 'title',
					title: 'Search title',
					type: 'string',
					validation: (rule) => rule.max(60)
				}),
				defineField({
					name: 'description',
					title: 'Search description',
					type: 'text',
					rows: 3,
					validation: (rule) => rule.max(160)
				}),
				defineField({
					name: 'socialImage',
					title: 'Social image',
					type: 'image',
					options: { hotspot: true }
				})
			]
		}),
		defineField({
			name: 'sections',
			title: 'Contact page sections',
			type: 'array',
			of: [
				defineArrayMember({ type: 'contactPanelSection' }),
				defineArrayMember({ type: 'imageBackgroundSection' }),
				defineArrayMember({ type: 'imageTextSection' }),
				defineArrayMember({ type: 'featuresSection' })
			],
			validation: (rule) =>
				rule
					.min(1)
					.required()
					.custom((sections) => {
						if (!Array.isArray(sections)) return true;
						const panels = (sections as Array<{ _type?: string }>).filter(
							(section) => section._type === 'contactPanelSection'
						).length;
						return panels === 1 ? true : 'Add exactly one Contact details and form section';
					})
		})
	],
	preview: {
		prepare() {
			return { title: 'Contact page', subtitle: 'Contact content and section order' };
		}
	}
});
