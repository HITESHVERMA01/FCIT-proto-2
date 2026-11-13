const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiClientError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers || {});
  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('fcit_token') : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await res.json()
    : null;

  if (!res.ok) {
    throw new ApiClientError(
      payload?.message || 'Request failed. Please try again.',
      res.status,
      payload?.details || null
    );
  }

  return payload;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (path, body) =>
    request(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  del: (path) => request(path, { method: 'DELETE' }),
};

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('/assets/')
  ) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    const base = import.meta.env.VITE_API_BASE_URL || '';
    if (base.startsWith('http')) {
      return `${base.replace(/\/api\/?$/, '')}${url}`;
    }
    return url;
  }
  return url;
}
