import { useAuthStore } from "@/lib/store/authStore";
import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const requestIntercepter = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(requestIntercepter);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.request.responseURL.includes("/log-out")
    ) {
      localStorage.clear();
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);
