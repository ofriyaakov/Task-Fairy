import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  isAxiosError,
} from "axios";
import { REFRESH_ROUTE, refreshToken } from "./tokenRefresher";
import axiosInstance from "../axiosInstance";

export const getErrorInterceptor = () => {
  let tokenRefresher: Promise<void> | undefined = undefined;
  return async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error?.response?.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry &&
      originalRequest.url !== REFRESH_ROUTE
    ) {
      originalRequest._retry = true;

      if (!tokenRefresher) {
        tokenRefresher = refreshToken();
      }

      try {
        await tokenRefresher;
        const result: AxiosResponse = await axiosInstance(originalRequest);

        tokenRefresher = undefined;

        return result;
      } catch (e) {
        if (
          isAxiosError(e) &&
          e?.response?.status === HttpStatusCode.Unauthorized
        ) {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");

          window.location.href = "/login";
        }
      }
    }

    throw error;
  };
};
