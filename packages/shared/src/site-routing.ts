/**
 * Single-segment paths owned by the application or reserved for app route namespaces.
 * Keep this list in sync with SvelteKit's static routes; the web suite checks coverage.
 */
export const APP_OWNED_PAGE_SLUGS = {
  about: "the current About page during CMS migration",
  account: "the account area",
  api: "application API endpoints",
  auth: "authentication endpoints",
  contact: "the Contact page",
  "forgot-password": "the password reset page",
  login: "the sign-in page",
  logout: "application sign-out behavior",
  "reset-password": "the password reset flow",
  signup: "the sign-up page",
  "two-factor": "the two-factor authentication page",
  users: "the employee users page",
  "verify-email": "the email verification page",
} as const;

export function getAppOwnedPageSlugReason(
  slug: string | undefined,
): string | undefined {
  if (!slug || !Object.hasOwn(APP_OWNED_PAGE_SLUGS, slug)) return undefined;
  return APP_OWNED_PAGE_SLUGS[slug as keyof typeof APP_OWNED_PAGE_SLUGS];
}
