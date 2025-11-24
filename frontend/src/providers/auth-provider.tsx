"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { loginUser, registerUser, getCurrentUser } from "@/lib/api/auth";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "movie-magic-token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    getCurrentUser(storedToken)
      .then((profile) => setUser(profile))
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistToken = useCallback((value: string | null) => {
    if (typeof window === "undefined") return;
    if (value) {
      window.localStorage.setItem(TOKEN_KEY, value);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokenResponse = await loginUser({ email, password });
      setToken(tokenResponse.access_token);
      persistToken(tokenResponse.access_token);
      const profile = await getCurrentUser(tokenResponse.access_token);
      setUser(profile);
      toast.success("Welcome back!");
    },
    [persistToken]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await registerUser({ email, password });
      await login(email, password);
      toast.success("Account created");
    },
    [login]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    persistToken(null);
    toast("Signed out");
  }, [persistToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout
    }),
    [user, token, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
