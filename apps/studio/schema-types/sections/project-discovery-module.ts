import { defineField, defineType } from 'sanity';
import { backgroundColourField, foregroundColourField } from '../objects/section-colour';

export const projectDiscoveryModule = defineType({
	name: 'projectDiscoveryModule',
	title: 'Project discovery',
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
			name: 'intro',
			title: 'Supporting text',
			type: 'text',
			rows: 2,
			validation: (rule) => rule.max(240)
		})
	],
	preview: {
		select: { title: 'heading.0.children.0.text' },
		prepare({ title }) {
			return { title: title || 'Project discovery', subtitle: 'App section: project discovery' };
		}
	}
});
