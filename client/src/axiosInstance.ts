import axios from "axios";
import { getErrorInterceptor } from "./queries/responseHandler";

const backendUrl = "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "accessToken"
    )}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  getErrorInterceptor()
);

export default axiosInstance;

export const refreshAxiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});
