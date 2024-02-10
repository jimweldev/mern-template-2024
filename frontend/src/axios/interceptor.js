import axios from "axios";

const privateInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
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

const publicInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export { privateInstance, publicInstance };
