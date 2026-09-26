export function safePreviewRedirect(requestedRedirect: string | null, origin: string): string {
	if (!requestedRedirect?.startsWith('/') || requestedRedirect.startsWith('//')) return '/';

	try {
		const candidate = new URL(requestedRedirect, origin);
		if (candidate.origin !== origin) return '/';
		return `${candidate.pathname}${candidate.search}${candidate.hash}`;
	} catch {
		return '/';
	}
}
