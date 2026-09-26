import { defineArrayMember, defineField, defineType } from 'sanity';

export const headingText = defineType({
	name: 'headingText',
	title: 'Heading text',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [{ title: 'Normal', value: 'normal' }],
			lists: [],
			marks: {
				decorators: [
					{ title: 'Bold', value: 'strong' },
					{ title: 'Italic', value: 'em' }
				],
				annotations: [
					defineArrayMember({
						type: 'object',
						name: 'foregroundColour',
						title: 'Foreground colour',
						fields: [
							defineField({
								name: 'source',
								type: 'string',
								initialValue: 'section',
								hidden: true
							})
						]
					})
				]
			}
		})
	]
});
