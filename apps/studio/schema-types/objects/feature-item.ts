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
			type: 'lucide-icon',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'iconColor',
			title: 'Icon color',
			type: 'string',
			options: {
				list: [
					{ title: 'Primary', value: 'primary' },
					{ title: 'Secondary', value: 'secondary' },
					{ title: 'Accent', value: 'accent' }
				],
				layout: 'radio'
			},
			initialValue: 'primary',
			validation: (rule) => rule.required()
		})
	]
});
