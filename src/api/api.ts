import { useAuthStore } from "@/lib/store/authStore";
import axios from "axios";
export const api = axios.create({
  baseURL: "http://localhost:3334",
});
const requestIntercepter = (config: any) => {
  //@ts-ignore
  config.headers.Authorization = "Bearer " + useAuthStore.getState().token;
  return config;
};

api.interceptors.request.use(requestIntercepter);
