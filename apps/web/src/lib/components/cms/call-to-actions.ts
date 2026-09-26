import type { ButtonVariant } from '$lib/components/ui/button';
import type { CmsPageQueryResult } from '$lib/sanity/sanity.types';
import { stegaClean } from '@sanity/sveltekit';

type PageSection = NonNullable<NonNullable<CmsPageQueryResult>['sections']>[number];
type ImageTextSection = Extract<PageSection, { _type: 'imageTextSection' }>;
export type SectionCallToAction = NonNullable<ImageTextSection['callToActions']>[number];

export function callToActionVariant(
	style: string | null | undefined,
	foregroundColour: string
): ButtonVariant {
	const cleanedStyle = stegaClean(style ?? 'match');
	if (cleanedStyle === 'outline') return 'outline';
	if (
		cleanedStyle === 'secondary' ||
		(cleanedStyle === 'match' && foregroundColour === 'secondary')
	) {
		return 'secondary';
	}
	return 'default';
}
