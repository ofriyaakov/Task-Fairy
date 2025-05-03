import axiosInstance from "../axiosInstance";
import { accessTokenKey, loggedUserIdKey } from "../consts";
import { RegistrationData } from "../views/Registration/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  companyId: string;
  userLevel: number;
  groupId: number;
  groupName: string;
}

const AUTH_ROUTE = "/auth";
// Login function
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post(`${AUTH_ROUTE}/login`, payload);
    localStorage.setItem(loggedUserIdKey, response.data.id);
    localStorage.setItem(accessTokenKey, response.data.accessToken);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Register function
export const register = async (
  payload: RegistrationData
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post(
      `${AUTH_ROUTE}/register`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
