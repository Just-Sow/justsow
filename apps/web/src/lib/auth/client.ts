export interface AuthErrorPayload {
	message?: string;
	code?: string;
	error?: string;
	requiredForRoles?: string[];
}

export interface AuthRequestResult<T> {
	ok: boolean;
	status: number;
	data: T | null;
	error: AuthErrorPayload | null;
}

const parseJson = async <T>(response: Response) => {
	const contentType = response.headers.get('content-type') ?? '';

	if (!contentType.includes('application/json')) {
		return null;
	}

	return (await response.json()) as T;
};

export const authRequest = async <T>(
	path: string,
	init: RequestInit = {}
): Promise<AuthRequestResult<T>> => {
	const headers = new Headers(init.headers);

	if (init.body && !headers.has('content-type')) {
		headers.set('content-type', 'application/json');
	}

	const response = await fetch(path, {
		credentials: 'include',
		...init,
		headers
	});

	const payload = await parseJson<T & AuthErrorPayload>(response);

	return {
		ok: response.ok,
		status: response.status,
		data: response.ok ? payload : null,
		error: response.ok ? null : payload
	};
};

export const getAuthErrorMessage = (
	result: Pick<AuthRequestResult<unknown>, 'status' | 'error'>,
	fallback: string
) => {
	if (result.error?.message) {
		return result.error.message;
	}

	if (result.error?.error === 'TWO_FACTOR_REQUIRED') {
		return 'Two-factor authentication is required before you can continue.';
	}

	if (result.status === 401) {
		return 'Your email or password was not accepted.';
	}

	if (result.status === 403) {
		return 'This action is not allowed yet. Check verification or two-factor requirements.';
	}

	return fallback;
};
