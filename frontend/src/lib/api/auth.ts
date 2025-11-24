import apiClient from "@/lib/api-client";
import type { AuthUser, TokenPayload } from "@/types";

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthUser> => {
  const { data } = await apiClient.post<AuthUser>("/auth/register", payload);
  return data;
};

export const loginUser = async (payload: LoginPayload): Promise<TokenPayload> => {
  const { data } = await apiClient.post<TokenPayload>("/auth/login", payload);
  return data;
};

export const getCurrentUser = async (token: string): Promise<AuthUser> => {
  const { data } = await apiClient.get<AuthUser>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};
