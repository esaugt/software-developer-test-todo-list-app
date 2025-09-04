import { request, tokenStore, clearSession } from './client';

// Waiting backend (Sanctum typical):
// login/register => { user: {...}, token: "<plainTextToken>" }
export async function apiLogin({ email, password }) {
    const data = await request('/login', {
        method: 'POST',
        body: { email, password },
        auth: 'none'
    });
    if (data?.token) tokenStore.setToken(data.token);
    return data.user;
}

export async function apiRegister({ name, email, password }) {
    const data = await request('/register', {
        method: 'POST',
        body: { name, email, password },
        auth: 'none'
    });
    
    if (data?.token) tokenStore.setToken(data.token);
    return data.user;
}

export async function apiLogout() {
    try {
        await request('/logout', { method: 'POST', auth: 'required' });
    } finally {
        clearSession();
    }
}
