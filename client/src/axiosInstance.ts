import axios from "axios";
import { getErrorInterceptor } from "./queries/responseHandler";
import { accessTokenKey } from "./consts";

const backendUrl = "https://taskfairy.cs.colman.ac.il:4000";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem(
      accessTokenKey
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
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
