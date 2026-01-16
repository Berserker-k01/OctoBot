import React, { createContext, useContext, useState, useEffect } from 'react';

import { authApi } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const user = await authApi.getProfile();
                    setCurrentUser(user);
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const data = await authApi.login(email, password);
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return data.user;
    };

    const register = async (email, password) => {
        const data = await authApi.register(email, password);
        // Auto login after register? Or just return success
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
