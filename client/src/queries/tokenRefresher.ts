import { data } from "react-router-dom";
import { refreshAxiosInstance } from "../axiosInstance";
import { accessTokenKey, refreshTokenKey } from "../consts";

export const REFRESH_ROUTE = "/auth/refresh";

export const refreshToken = async (): Promise<void> => {
  const res = await refreshAxiosInstance.get(REFRESH_ROUTE, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem(refreshTokenKey),
    },
  });
  console.log("refreshToken", data);
  const { accessToken, refreshToken } = res.data;

  if (accessToken) {
    localStorage.setItem(accessTokenKey, accessToken);
    localStorage.setItem(refreshTokenKey, refreshToken);
  }
};
