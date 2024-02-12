import axios from "axios";
// stores
import useAuthStore from "@store/authStore";

const privateInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

privateInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

privateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const response = await privateInstance.get("api/auth/refresh");

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
      }

      if (response.status === 204) {
        // USE THE REMOVE AUTH HERE
        useAuthStore.getState().removeAuth();
        localStorage.removeItem("accessToken");
      }

      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

const publicInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export { privateInstance, publicInstance };
