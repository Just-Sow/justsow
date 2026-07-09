import { resetDatabaseState } from '../scripts/database-state.js';

export const resetTestState = async () => {
  await resetDatabaseState();
};

export const getSetCookieHeader = (
  setCookie: string | string[] | undefined
) => {
  if (!setCookie) {
    return '';
  }

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

  return cookies.map((cookie) => cookie.split(';', 1)[0]).join('; ');
};

export const extractTokenFromUrl = (url: string) => {
  return new URL(url).searchParams.get('token');
};
