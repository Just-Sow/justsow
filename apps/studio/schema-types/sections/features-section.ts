import { defineArrayMember, defineField, defineType } from 'sanity';

export const featuresSection = defineType({
	name: 'featuresSection',
	title: 'Features',
	type: 'object',
	fields: [
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'string',
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
			name: 'features',
			title: 'Features',
			type: 'array',
			of: [defineArrayMember({ type: 'featureItem' })],
			validation: (rule) => rule.min(1).max(4).required()
		})
	]
});
