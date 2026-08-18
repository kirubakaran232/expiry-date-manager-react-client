import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = sessionStorage.getItem('auth_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const saveUser = useCallback((userData) => {
        setUser(userData);
        if (userData) {
            sessionStorage.setItem('auth_user', JSON.stringify(userData));
        } else {
            sessionStorage.removeItem('auth_user');
        }
    }, []);

    const logout = useCallback(() => {
        saveUser(null);
        // Optionally call a logout endpoint to clear the cookie
    }, [saveUser]);

    return (
        <AuthContext.Provider value={{ user, saveUser, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
