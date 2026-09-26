import { defineArrayMember, defineField, defineType } from 'sanity';
import { foregroundColourField } from '../objects/section-colour';

export const imageBackgroundSection = defineType({
	name: 'imageBackgroundSection',
	title: 'Background image',
	type: 'object',
	fields: [
		foregroundColourField(),
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
		defineField({
			name: 'callToActions',
			title: 'Calls to action',
			type: 'array',
			description: 'Optional',
			of: [defineArrayMember({ type: 'sectionCallToAction' })]
		})
	],
	preview: {
		select: { title: 'heading.0.children.0.text', media: 'backgroundImage.asset' },
		prepare({ title, media }) {
			return { title: title || 'Background image', subtitle: 'Background image section', media };
		}
	}
});
