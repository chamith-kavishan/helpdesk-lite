import axios from "axios";
import Cookies from "js-cookie";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000",
});

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
