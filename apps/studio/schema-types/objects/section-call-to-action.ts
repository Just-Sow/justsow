import { defineField, defineType } from 'sanity';
import { siteLinkFields } from './site-link';

export const sectionCallToAction = defineType({
	name: 'sectionCallToAction',
	title: 'Call to action',
	type: 'object',
	initialValue: { destinationType: 'internal', style: 'match' },
	fields: [
		...siteLinkFields,
		defineField({
			name: 'style',
			title: 'Button style',
			type: 'string',
			options: {
				list: [
					{ title: 'Match section', value: 'match' },
					{ title: 'Primary', value: 'primary' },
					{ title: 'Secondary', value: 'secondary' },
					{ title: 'Outline', value: 'outline' }
				],
				layout: 'radio'
			},
			initialValue: 'match'
		})
	],
	preview: {
		select: { title: 'label', subtitle: 'style' },
		prepare({ title, subtitle }) {
			const styles: Record<string, string> = {
				match: 'Match section',
				primary: 'Primary',
				secondary: 'Secondary',
				outline: 'Outline'
			};
			return {
				title: title || 'Call to action',
				subtitle: styles[subtitle ?? 'match'] ?? 'Match section'
			};
		}
	}
});
