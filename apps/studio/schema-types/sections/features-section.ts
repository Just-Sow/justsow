import { defineArrayMember, defineField, defineType } from 'sanity';
import { backgroundColourField, foregroundColourField } from '../objects/section-colour';

export const featuresSection = defineType({
	name: 'featuresSection',
	title: 'Icon grid',
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
			name: 'intro',
			title: 'Intro',
			type: 'text',
			rows: 3
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
			name: 'features',
			title: 'Features',
			type: 'array',
			of: [defineArrayMember({ type: 'featureItem' })],
			validation: (rule) => rule.min(1).required()
		})
	],
	preview: {
		select: { title: 'heading.0.children.0.text' },
		prepare({ title }) {
			return { title: title || 'Icon grid', subtitle: 'Icon grid section' };
		}
	}
});
