import { defineField, defineType } from 'sanity';

export const siteLink = defineType({
	name: 'siteLink',
	title: 'Site link',
	type: 'object',
	fields: [
		defineField({
			name: 'label',
			title: 'Link label',
			type: 'string',
			validation: (rule) => rule.required().max(50)
		}),
		defineField({
			name: 'destinationType',
			title: 'Destination type',
			type: 'string',
			options: {
				list: [
					{ title: 'CMS page', value: 'page' },
					{ title: 'Public site route', value: 'route' },
					{ title: 'External website', value: 'external' }
				],
				layout: 'radio'
			},
			initialValue: 'page',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'page',
			title: 'Page',
			type: 'reference',
			to: [{ type: 'page' }],
			hidden: ({ parent }) => parent?.destinationType !== 'page',
			validation: (rule) =>
				rule.custom((value, context) =>
					(context.parent as { destinationType?: string } | undefined)?.destinationType ===
						'page' && !value
						? 'Choose a page'
						: true
				)
		}),
		defineField({
			name: 'route',
			title: 'Public site route',
			type: 'string',
			options: {
				list: [
					{ title: 'Home', value: '/' },
					{ title: 'Contact', value: '/contact' }
				],
				layout: 'dropdown'
			},
			hidden: ({ parent }) => parent?.destinationType !== 'route',
			validation: (rule) =>
				rule.custom((value, context) =>
					(context.parent as { destinationType?: string } | undefined)?.destinationType ===
						'route' && !value
						? 'Choose a route'
						: true
				)
		}),
		defineField({
			name: 'externalUrl',
			title: 'External URL',
			type: 'url',
			hidden: ({ parent }) => parent?.destinationType !== 'external',
			validation: (rule) =>
				rule
					.uri({ scheme: ['http', 'https'] })
					.custom((value, context) =>
						(context.parent as { destinationType?: string } | undefined)?.destinationType ===
							'external' && !value
							? 'Enter an HTTP or HTTPS URL'
							: true
					)
		}),
		defineField({
			name: 'openInNewTab',
			title: 'Open in a new tab',
			type: 'boolean',
			initialValue: false,
			hidden: ({ parent }) => parent?.destinationType !== 'external'
		})
	]
});
