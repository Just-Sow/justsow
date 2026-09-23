import { defineField, defineType } from 'sanity';

export const featureItem = defineType({
	name: 'featureItem',
	title: 'Feature',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'icon',
			title: 'Icon',
			type: 'string',
			options: {
				list: [
					{ title: 'Sprout', value: 'sprout' },
					{ title: 'Water', value: 'water' },
					{ title: 'Sun', value: 'sun' },
					{ title: 'Idea', value: 'idea' },
					{ title: 'Partnership', value: 'partnership' },
					{ title: 'Tree', value: 'tree' }
				],
				layout: 'dropdown'
			},
			validation: (rule) => rule.required()
		})
	]
});
