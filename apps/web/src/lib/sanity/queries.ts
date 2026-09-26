import { defineQuery } from '@sanity/sveltekit';

const callToActionsProjection = `
				callToActions[] {
					_key,
					label,
					style,
					destinationType,
					externalUrl,
					openInNewTab,
					"pageSlug": page->slug.current,
					"internalPageType": page->_type
				}
`;

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
				foregroundColour,
				eyebrow,
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
				${callToActionsProjection}
			},
			_type == "imageTextSection" => {
				foregroundColour,
				backgroundColour,
				eyebrow,
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
				${callToActionsProjection}
			},
			_type == "featuresSection" => {
				foregroundColour,
				backgroundColour,
				eyebrow,
				heading,
				intro,
				textAlignment,
				features[] {
					_key,
					title,
					description,
					icon,
					iconColor
				}
			}
		}
	}
`);

export const siteNavigationQuery = defineQuery(`
	*[_type == "siteNavigation" && _id == "siteNavigation"][0] {
		headerLinks[] {
			_key,
			label,
			destinationType,
			externalUrl,
			openInNewTab,
			"pageSlug": page->slug.current,
			"internalPageType": page->_type
		},
		footerGroups[] {
			_key,
			heading,
			links[] {
				_key,
				label,
				destinationType,
				externalUrl,
				openInNewTab,
				"pageSlug": page->slug.current,
				"internalPageType": page->_type
			}
		}
	}
`);

const editorialSectionProjection = `
			_type == "imageBackgroundSection" => {
				foregroundColour,
				eyebrow,
				heading,
				body,
				textAlignment,
				backgroundImage { alt, asset { asset, crop, hotspot } },
				${callToActionsProjection}
			},
			_type == "imageTextSection" => {
				foregroundColour,
				backgroundColour,
				eyebrow,
				heading,
				body,
				imagePosition,
				textAlignment,
				image { alt, asset { asset, crop, hotspot } },
				${callToActionsProjection}
			},
			_type == "featuresSection" => {
				foregroundColour,
				backgroundColour,
				eyebrow,
				heading,
				intro,
				textAlignment,
				features[] { _key, title, description, icon, iconColor }
			}
`;

export const homePageQuery = defineQuery(`
	*[_type == "homePage" && _id == "homePage"][0] {
		seo { title, description, socialImage { asset { asset, crop, hotspot } } },
		sections[] {
			_key,
			_type,
			_type == "homeHeroSection" => {
				eyebrow,
				foregroundColour,
				backgroundColour,
				heading,
				body,
				image { alt, asset { asset, crop, hotspot } }
			},
			_type == "projectDiscoveryModule" => { foregroundColour, backgroundColour, heading, intro },
			${editorialSectionProjection}
		}
	}
`);

export const contactPageQuery = defineQuery(`
	*[_type == "contactPage" && _id == "contactPage"][0] {
		seo { title, description, socialImage { asset { asset, crop, hotspot } } },
		sections[] {
			_key,
			_type,
			_type == "contactPanelSection" => {
				foregroundColour,
				backgroundColour,
				heading,
				body,
				email,
			},
			${editorialSectionProjection}
		}
	}
`);
