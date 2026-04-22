import api from "@/api/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  APIResponse,
  User,
} from "@/types";

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

  forgotPassword: async (email: string): Promise<APIResponse<null>> => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  resetPassword: async (
    token: string,
    data: any
  ): Promise<APIResponse<null>> => {
    const { data: responseData } = await api.post(
      `/auth/reset-password/${token}`,
      data
    );
    return responseData;
  },

  resetPasswordDirect: async (data: any): Promise<APIResponse<null>> => {
    const { data: responseData } = await api.post(
      "/auth/reset-password-direct",
      data
    );
    return responseData;
  },
};