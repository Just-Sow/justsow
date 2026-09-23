import { page } from './documents/page';
import { siteNavigation } from './documents/site-navigation';
import { featureItem } from './objects/feature-item';
import { imageWithAlt } from './objects/image-with-alt';
import { richText } from './objects/rich-text';
import { siteLink } from './objects/site-link';
import { featuresSection } from './sections/features-section';
import { imageBackgroundSection } from './sections/image-background-section';
import { imageTextSection } from './sections/image-text-section';

export const schemaTypes = [
	page,
	siteNavigation,
	richText,
	siteLink,
	imageWithAlt,
	featureItem,
	imageBackgroundSection,
	imageTextSection,
	featuresSection
];
