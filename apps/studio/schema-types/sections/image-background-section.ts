import { defineField, defineType } from 'sanity';

export const imageBackgroundSection = defineType({
	name: 'imageBackgroundSection',
	title: 'Image background',
	type: 'object',
	fields: [
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({ name: 'body', title: 'Text', type: 'richText' }),
		defineField({
			name: 'backgroundImage',
			title: 'Background image',
			type: 'imageWithAlt',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'textAlignment',
			title: 'Text alignment',
			type: 'string',
			options: { list: ['left', 'center', 'right'], layout: 'radio' },
			initialValue: 'center',
			validation: (rule) => rule.required()
		}),
		defineField({ name: 'callToAction', title: 'Call to action', type: 'siteLink' })
	]
});
