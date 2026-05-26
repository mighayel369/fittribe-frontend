import axios from "axios";
import { store } from "../redux/store";
import { setAuth, clearAuth } from "../redux/slices/authSlice";
import { AuthService } from "../services/shared/auth.service";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

console.log("API URL:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const currentRole = store.getState().auth.role || localStorage.getItem('role');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      currentRole &&
      !originalRequest.url.includes('/refresh-token')
    ) {

      if (isRefreshing) {

        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await AuthService.refreshAccessToken(currentRole);
        const accessToken = res.accessToken;

        if (accessToken) {
          store.dispatch(setAuth({
            accessToken: accessToken,
            role: res.role || currentRole,
            user: store.getState().auth.user
          }));

          processQueue(null, accessToken);
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        store.dispatch(clearAuth());
        return Promise.reject(err);
      }
    }

    if (error.response) {
      const { status, data } = error.response;

      if ([403, 500].includes(status)) {
        const serverMessage = data?.message || "Internal Server Error";
        window.location.href = `/error?status=${status}&msg=${encodeURIComponent(serverMessage)}`;
      }

      const customErrorMessage = data?.message || "An unexpected error occurred.";
      return Promise.reject({ message: customErrorMessage });
    }

    return Promise.reject({ message: error.message || "Network error. Please check your connection." });
  }
);

export default axiosInstance;