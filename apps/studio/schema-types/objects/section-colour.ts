import { defineField } from 'sanity';

export const foregroundColourOptions = [
	{ title: 'Primary', value: 'primary' },
	{ title: 'Secondary', value: 'secondary' },
	{ title: 'Accent', value: 'accent' }
];

export const foregroundColourField = () =>
	defineField({
		name: 'foregroundColour',
		title: 'Foreground colour',
		type: 'string',
		options: { list: foregroundColourOptions, layout: 'radio' },
		initialValue: 'primary',
		validation: (rule) => rule.required()
	});

export const backgroundColourField = (initialValue = 'background') =>
	defineField({
		name: 'backgroundColour',
		title: 'Background colour',
		type: 'string',
		options: {
			list: [
				{ title: 'White', value: 'background' },
				{ title: 'Muted', value: 'muted' },
				{ title: 'Warm', value: 'warm' },
				{ title: 'Primary tint', value: 'primaryTint' }
			],
			layout: 'radio'
		},
		initialValue,
		validation: (rule) => rule.required()
	});
