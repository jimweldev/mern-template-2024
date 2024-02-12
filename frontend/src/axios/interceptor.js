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

// Refresh token interceptor
privateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const response = await axios.get(
        "http://localhost:4000/api/auth/refresh"
      );

      console.log(response);
      if (response.status === 200) {
        // login(response.data);
        localStorage.setItem("accessToken", response.data.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
      }

      if (response.status === 204) {
        // logout();
      }

      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

const publicInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export { privateInstance, publicInstance };
