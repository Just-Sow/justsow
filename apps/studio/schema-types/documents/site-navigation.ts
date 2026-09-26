import { LinkIcon } from '@sanity/icons/Link';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteNavigation = defineType({
	name: 'siteNavigation',
	title: 'Site navigation',
	type: 'document',
	icon: LinkIcon,
	fields: [
		defineField({
			name: 'headerLinks',
			title: 'Header links',
			type: 'array',
			of: [defineArrayMember({ type: 'siteLink' })],
			validation: (rule) => rule.max(6)
		}),
		defineField({
			name: 'footerGroups',
			title: 'Footer link groups',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'footerLinkGroup',
					fields: [
						defineField({
							name: 'heading',
							title: 'Group heading',
							type: 'string',
							validation: (rule) => rule.required()
						}),
						defineField({
							name: 'links',
							title: 'Links',
							type: 'array',
							of: [defineArrayMember({ type: 'siteLink' })],
							validation: (rule) => rule.max(8)
						})
					]
				})
			],
			validation: (rule) => rule.max(4)
		})
	],
	preview: {
		prepare() {
			return {
				title: 'Public site navigation',
				subtitle: 'Header links and footer groups'
			};
		}
	}
});
