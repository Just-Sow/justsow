import { defineArrayMember, defineField, defineType } from 'sanity';
import { backgroundColourField, foregroundColourField } from '../objects/section-colour';

export const imageTextSection = defineType({
	name: 'imageTextSection',
	title: 'Image and text',
	type: 'object',
	fields: [
		foregroundColourField(),
		backgroundColourField(),
		defineField({
			name: 'eyebrow',
			title: 'Eyebrow',
			type: 'string',
			validation: (rule) => rule.max(80)
		}),
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'headingText',
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
		defineField({
			name: 'callToActions',
			title: 'Calls to action',
			type: 'array',
			description: 'Optional',
			of: [defineArrayMember({ type: 'sectionCallToAction' })]
		})
	],
	preview: {
		select: { title: 'heading.0.children.0.text', media: 'image.asset' },
		prepare({ title, media }) {
			return { title: title || 'Image and text', subtitle: 'Image and text section', media };
		}
	}
});
