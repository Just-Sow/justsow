import { page } from './documents/page';
import { homePage } from './documents/home-page';
import { contactPage } from './documents/contact-page';
import { siteNavigation } from './documents/site-navigation';
import { featureItem } from './objects/feature-item';
import { imageWithAlt } from './objects/image-with-alt';
import { richText } from './objects/rich-text';
import { headingText } from './objects/heading-text';
import { siteLink } from './objects/site-link';
import { sectionCallToAction } from './objects/section-call-to-action';
import { featuresSection } from './sections/features-section';
import { imageBackgroundSection } from './sections/image-background-section';
import { imageTextSection } from './sections/image-text-section';
import { homeHeroSection } from './sections/home-hero-section';
import { projectDiscoveryModule } from './sections/project-discovery-module';
import { contactPanelSection } from './sections/contact-panel-section';

export const schemaTypes = [
	page,
	homePage,
	contactPage,
	siteNavigation,
	richText,
	headingText,
	siteLink,
	sectionCallToAction,
	imageWithAlt,
	featureItem,
	imageBackgroundSection,
	imageTextSection,
	featuresSection,
	homeHeroSection,
	projectDiscoveryModule,
	contactPanelSection
];
