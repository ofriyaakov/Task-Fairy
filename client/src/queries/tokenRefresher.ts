import { refreshAxiosInstance } from "../axiosInstance";

export const REFRESH_ROUTE = "/auth/refresh";

export const refreshToken = async (): Promise<void> => {
  const res = await refreshAxiosInstance.get(REFRESH_ROUTE, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("refreshToken"),
    },
  });

  const { accessToken, refreshToken } = res.data;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};
