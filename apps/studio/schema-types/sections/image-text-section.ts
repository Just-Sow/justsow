import { defineField, defineType } from 'sanity';

export const imageTextSection = defineType({
	name: 'imageTextSection',
	title: 'Image and text',
	type: 'object',
	fields: [
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'body',
			title: 'Text',
			type: 'richText',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'imageWithAlt',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'imagePosition',
			title: 'Image position',
			type: 'string',
			options: {
				list: [
					{ title: 'Left', value: 'left' },
					{ title: 'Right', value: 'right' }
				],
				layout: 'radio'
			},
			initialValue: 'right',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'textAlignment',
			title: 'Text alignment',
			type: 'string',
			options: { list: ['left', 'center', 'right'], layout: 'radio' },
			initialValue: 'left',
			validation: (rule) => rule.required()
		}),
		defineField({ name: 'callToAction', title: 'Call to action', type: 'siteLink' })
	]
});
