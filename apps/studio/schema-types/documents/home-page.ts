import { HomeIcon } from '@sanity/icons/Home';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const homePage = defineType({
	name: 'homePage',
	title: 'Home page',
	type: 'document',
	icon: HomeIcon,
	fields: [
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
			title: 'Home page sections',
			type: 'array',
			of: [
				defineArrayMember({ type: 'homeHeroSection' }),
				defineArrayMember({ type: 'imageBackgroundSection' }),
				defineArrayMember({ type: 'imageTextSection' }),
				defineArrayMember({ type: 'featuresSection' }),
				defineArrayMember({ type: 'projectDiscoveryModule' })
			],
			validation: (rule) =>
				rule
					.min(2)
					.required()
					.custom((sections) => {
						if (!Array.isArray(sections)) return true;
						const typedSections = sections as Array<{ _type?: string }>;
						const heroes = typedSections.filter(
							(section) => section._type === 'homeHeroSection'
						).length;
						const projectModules = typedSections.filter(
							(section) => section._type === 'projectDiscoveryModule'
						).length;
						if (heroes !== 1) return 'Add exactly one Home hero section';
						if (projectModules !== 1) return 'Add exactly one Project discovery app section';
						return true;
					})
		})
	],
	preview: {
		prepare() {
			return { title: 'Home page', subtitle: 'Homepage content and section order' };
		}
	}
});
