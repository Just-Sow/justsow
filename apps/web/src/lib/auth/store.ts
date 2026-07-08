import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { AuthViewer } from './session.js';

const authStoreContextKey = Symbol('auth-store');

export type AuthStore = Writable<AuthViewer | null>;

export const createAuthStore = (initialValue: AuthViewer | null): AuthStore => {
	return writable(initialValue);
};

export const setAuthStore = (store: AuthStore) => {
	setContext(authStoreContextKey, store);
	return store;
};

export const getAuthStore = () => {
	const store = getContext<AuthStore | undefined>(authStoreContextKey);

	if (!store) {
		throw new Error('Auth store is not available in this component tree.');
	}

	return store;
};
