import React, { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/userService";
import { logout as logoutService } from "../services/authService";
import { User } from "../types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginSuccess: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loginSuccess = async () => {
        const profile = await getProfile();
        setUser(profile);
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const profile = await getProfile();
                setUser(profile);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, loginSuccess, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
