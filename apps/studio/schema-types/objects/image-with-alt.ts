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
			description: 'Leave blank for decorative images.',
			validation: (rule) => rule.max(160)
		})
	]
});
