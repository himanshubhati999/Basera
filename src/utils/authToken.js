const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

const normalizeToken = (rawToken) => {
  if (typeof rawToken !== 'string') return null;

  const token = rawToken.trim();
  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }

  return token;
};

const decodeTokenPayload = (token) => {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return null;

    const base64Payload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, '=');
    const payload = atob(paddedBase64);

    return JSON.parse(payload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) return true;

  const payload = decodeTokenPayload(normalizedToken);
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

export const clearAuthStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getValidatedStoredToken = () => {
  const token = normalizeToken(localStorage.getItem(TOKEN_STORAGE_KEY));

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearAuthStorage();
    return null;
  }

  return token;
};
