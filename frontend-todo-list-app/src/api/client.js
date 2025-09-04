
function joinURL(base, path) {
    if (!base) return path;
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${b}${p}`;
}

const API_BASE = import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_URL ?? '/api');

// Gestion of auth token in localStorage
function getToken() {
    return localStorage.getItem('auth:token') || null;
}
function setToken(token) {
    if (token) localStorage.setItem('auth:token', token);
    else localStorage.removeItem('auth:token');
}

export function clearSession() {
    setToken(null);
    localStorage.removeItem('auth:user');
}

export async function request(path, { method = 'GET', headers = {}, body, auth = 'optional', ...rest } = {}) {
    const url = path.startsWith('http') ? path : joinURL(API_BASE, path);
    const token = getToken();

    const baseHeaders = { 'Content-Type': 'application/json', ...headers };
    const authHeaders = (auth !== 'none' && token) ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(url, {
        method,
        headers: { ...baseHeaders, ...authHeaders },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        
        ...rest,
    });

    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
        const err = new Error(
            (isJson && (data?.message || data?.error)) || `HTTP ${res.status}`
        );
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

export const tokenStore = { getToken, setToken };
