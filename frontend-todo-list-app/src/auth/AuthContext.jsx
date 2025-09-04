import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiLogout } from '../api/auth';
import { tokenStore } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('auth:user');
        return raw ? JSON.parse(raw) : null;
    });

    useEffect(() => {
        if (user) localStorage.setItem('auth:user', JSON.stringify(user));
        else localStorage.removeItem('auth:user');
    }, [user]);

    const isAuth = !!user && !!tokenStore.getToken();

    const login = async (creds) => {
        const u = await apiLogin(creds);
        setUser(u);
        return u;
    };

    const register = async (payload) => {
        const u = await apiRegister(payload);

        if (u) setUser(u);
        return u;
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    const value = useMemo(() => ({ user, isAuth, login, register, logout }), [user, isAuth]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth will be use in <AuthProvider>');
    return ctx;
}
