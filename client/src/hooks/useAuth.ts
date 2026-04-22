// client/src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { LoginCredentials, RegisterCredentials } from "@/types";

export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),

    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;

      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.name}!`);
    },

    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Login failed. Please try again.";

      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),

    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Account created! Welcome, ${user.name}`);
    },

    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Registration failed. Please try again.";

      toast.error(message);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (response) => {
      toast.success(response.message || "Reset link sent to your email!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to send reset link.";
      toast.error(message);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: any }) =>
      authApi.resetPassword(token, data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successful!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to reset password.";
      toast.error(message);
    },
  });
};

export const useResetPasswordDirect = () => {
  return useMutation({
    mutationFn: (data: any) => authApi.resetPasswordDirect(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update password.";
      toast.error(message);
    },
  });
};
