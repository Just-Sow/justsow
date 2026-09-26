import { defineField, defineType } from 'sanity';
import { backgroundColourField, foregroundColourField } from '../objects/section-colour';

export const homeHeroSection = defineType({
	name: 'homeHeroSection',
	title: 'Hero',
	type: 'object',
	fields: [
		defineField({
			name: 'eyebrow',
			title: 'Eyebrow',
			type: 'string',
			validation: (rule) => rule.required().max(80)
		}),
		foregroundColourField(),
		backgroundColourField(),
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'headingText',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'body',
			title: 'Supporting text',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(240)
		}),
		defineField({
			name: 'image',
			title: 'Hero image',
			type: 'imageWithAlt',
			validation: (rule) => rule.required()
		})
	],
	preview: {
		select: { title: 'heading.0.children.0.text', media: 'image.asset' },
		prepare({ title, media }) {
			return { title: title || 'Hero', subtitle: 'Hero', media };
		}
	}
});
