import { defineArrayMember, defineType } from 'sanity';

export const richText = defineType({
	name: 'richText',
	title: 'Rich text',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [
				{ title: 'Normal', value: 'normal' },
				{ title: 'Quote', value: 'blockquote' }
			],
			lists: [],
			marks: {
				decorators: [
					{ title: 'Bold', value: 'strong' },
					{ title: 'Italic', value: 'em' }
				],
				annotations: []
			}
		})
	]
});
