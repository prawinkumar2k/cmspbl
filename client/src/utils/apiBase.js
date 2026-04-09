const normalizeApiBaseUrl = (value) => {
  const baseUrl = (value || '/api').trim();

  if (!baseUrl) {
    return '/api';
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

export const getApiBaseUrl = () => normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const buildApiUrl = (path = '') => {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};
