import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType } from 'sanity';

const reservedSlugs = new Set([
	'account',
	'api',
	'auth',
	'contact',
	'dashboard',
	'forgot-password',
	'login',
	'logout',
	'reset-password',
	'signup',
	'two-factor',
	'users',
	'verify-email'
]);

export const page = defineType({
	name: 'page',
	title: 'Page',
	type: 'document',
	icon: DocumentIcon,
	fields: [
		defineField({
			name: 'title',
			title: 'Page title',
			type: 'string',
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'URL path',
			type: 'slug',
			options: { source: 'title', maxLength: 64 },
			validation: (rule) =>
				rule.required().custom((value) => {
					const slug = value?.current;
					if (!slug) return 'Create a URL path';
					if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
						return 'Use one lowercase URL segment with hyphens only';
					}
					if (reservedSlugs.has(slug)) return 'This path is reserved by the application';
					return true;
				})
		}),
		defineField({
			name: 'seo',
			title: 'Search and social metadata',
			type: 'object',
			fields: [
				defineField({
					name: 'title',
					title: 'Search title',
					type: 'string',
					validation: (rule) => rule.max(60)
				}),
				defineField({
					name: 'description',
					title: 'Search description',
					type: 'text',
					rows: 3,
					validation: (rule) => rule.max(160)
				}),
				defineField({
					name: 'socialImage',
					title: 'Social image',
					type: 'image',
					options: { hotspot: true }
				})
			]
		}),
		defineField({
			name: 'sections',
			title: 'Page sections',
			type: 'array',
			of: [
				defineArrayMember({ type: 'imageBackgroundSection' }),
				defineArrayMember({ type: 'imageTextSection' }),
				defineArrayMember({ type: 'featuresSection' })
			],
			validation: (rule) => rule.min(1).required()
		})
	],
	preview: {
		select: { title: 'title', subtitle: 'slug.current' },
		prepare({ title, subtitle }) {
			return { title, subtitle: subtitle ? `/${subtitle}` : 'Page' };
		}
	}
});
