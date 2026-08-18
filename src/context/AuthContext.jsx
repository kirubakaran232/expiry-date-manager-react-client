import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getMe, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true while verifying cookie on load

    // On mount: verify the httpOnly cookie with the server.
    // This handles page refresh — if the cookie is still valid, restore the session.
    // If it's gone or expired, clear any stale sessionStorage and stay logged out.
    useEffect(() => {
        getMe()
            .then(({ user }) => setUser(user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const saveUser = useCallback((userData) => {
        setUser(userData);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutUser(); // tells server to clear the cookie
        } catch {
            // ignore network errors on logout
        }
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, saveUser, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
