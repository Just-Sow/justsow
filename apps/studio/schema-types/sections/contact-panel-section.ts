import { defineField, defineType } from 'sanity';
import { backgroundColourField, foregroundColourField } from '../objects/section-colour';

export const contactPanelSection = defineType({
	name: 'contactPanelSection',
	title: 'Contact details and form',
	type: 'object',
	fields: [
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
			title: 'Introduction',
			type: 'text',
			rows: 4,
			validation: (rule) => rule.required().max(500)
		}),
		defineField({
			name: 'email',
			title: 'Contact email',
			type: 'string',
			validation: (rule) => rule.required().email()
		})
	],
	preview: {
		select: { title: 'heading.0.children.0.text' },
		prepare({ title }) {
			return { title: title || 'Contact details and form', subtitle: 'App module: contact form' };
		}
	}
});
