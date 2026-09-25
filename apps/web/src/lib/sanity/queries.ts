import { defineQuery } from '@sanity/sveltekit';

export const cmsPageQuery = defineQuery(`
	*[_type == "page" && slug.current == $slug][0] {
		_id,
		_type,
		title,
		slug,
		seo {
			title,
			description,
			socialImage
		},
		sections[] {
			_key,
			_type,
			_type == "imageBackgroundSection" => {
				heading,
				body,
				textAlignment,
				backgroundImage {
					alt,
					asset {
						asset,
						crop,
						hotspot
					}
				},
				callToAction {
					label,
					destinationType,
					route,
					externalUrl,
					openInNewTab,
					"pageSlug": page->slug.current
				}
			},
			_type == "imageTextSection" => {
				heading,
				body,
				imagePosition,
				textAlignment,
				image {
					alt,
					asset {
						asset,
						crop,
						hotspot
					}
				},
				callToAction {
					label,
					destinationType,
					route,
					externalUrl,
					openInNewTab,
					"pageSlug": page->slug.current
				}
			},
			_type == "featuresSection" => {
				heading,
				textAlignment,
				features[] {
					_key,
					title,
					description,
					icon
				}
			}
		}
	}
`);
