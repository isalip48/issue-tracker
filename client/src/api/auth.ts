import api from "./axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  APIResponse,
  User,
} from "../types";

interface AuthResponse {
  user:         User;
  accessToken:  string;
  refreshToken: string;
}

export const authApi = {
  register: async (
    credentials: RegisterCredentials
  ): Promise<APIResponse<AuthResponse>> => {
    const { data } = await api.post("/auth/register", credentials);
    return data;
  },

  login: async (
    credentials: LoginCredentials
  ): Promise<APIResponse<AuthResponse>> => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  getMe: async (): Promise<APIResponse<{ user: User }>> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};