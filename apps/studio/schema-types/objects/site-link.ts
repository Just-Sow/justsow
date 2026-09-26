import { defineField, defineType } from 'sanity';

const isSectionCallToAction = (path: readonly unknown[] | undefined) =>
	path?.includes('callToActions') ?? false;

export const siteLinkFields = [
	defineField({
		name: 'label',
		title: 'Link label',
		type: 'string',
		validation: (rule) =>
			rule.max(50).custom((value, context) => {
				if (isSectionCallToAction(context.path)) return true;
				return value ? true : 'Add a link label';
			})
	}),
	defineField({
		name: 'destinationType',
		title: 'Destination type',
		type: 'string',
		options: {
			list: [
				{ title: 'Internal page', value: 'internal' },
				{ title: 'External website', value: 'external' }
			],
			layout: 'radio'
		},
		initialValue: 'internal',
		validation: (rule) =>
			rule.custom((value, context) => {
				if (isSectionCallToAction(context.path)) return true;
				return value ? true : 'Choose a destination type';
			})
	}),
	defineField({
		name: 'page',
		title: 'Internal page',
		type: 'reference',
		to: [{ type: 'homePage' }, { type: 'contactPage' }, { type: 'page' }],
		hidden: ({ parent }) => parent?.destinationType === 'external',
		validation: (rule) =>
			rule.custom((value, context) =>
				isSectionCallToAction(context.path)
					? true
					: (context.parent as { destinationType?: string } | undefined)?.destinationType ===
								'internal' && !value
						? 'Choose an internal page'
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
					isSectionCallToAction(context.path) ||
					(context.parent as { destinationType?: string } | undefined)?.destinationType !==
						'external' ||
					value
						? true
						: 'Enter an HTTP or HTTPS URL'
				)
	}),
	defineField({
		name: 'openInNewTab',
		title: 'Open in a new tab',
		type: 'boolean',
		initialValue: false,
		hidden: ({ parent }) => parent?.destinationType !== 'external'
	})
];

export const siteLink = defineType({
	name: 'siteLink',
	title: 'Site link',
	type: 'object',
	initialValue: { destinationType: 'internal' },
	fields: siteLinkFields
});
