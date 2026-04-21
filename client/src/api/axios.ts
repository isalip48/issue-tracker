import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

const failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue.length = 0;
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken, user } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // The backend might return { data: { accessToken, refreshToken } } or { accessToken, refreshToken }
        const { accessToken, refreshToken: newRefreshToken } = response.data.data 
          ? response.data.data 
          : response.data;

        if (user && accessToken) {
          useAuthStore.getState().setAuth(
            user, 
            accessToken, 
            newRefreshToken || refreshToken
          );
        }

        originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
        
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        
        // Prevent infinite loops or redirect issues during dev
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
