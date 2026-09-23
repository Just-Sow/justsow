import { defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
	name: 'imageWithAlt',
	title: 'Image with alt text',
	type: 'object',
	fields: [
		defineField({
			name: 'asset',
			title: 'Image',
			type: 'image',
			options: { hotspot: true },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'alt',
			title: 'Alternative text',
			type: 'string',
			description: 'Describe the image for people using a screen reader.',
			validation: (rule) => rule.required().max(160)
		})
	]
});
