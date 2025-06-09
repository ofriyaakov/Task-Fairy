import axiosInstance from "../axiosInstance";
import { employeeData } from "../types/employee";
import { newEmployee } from "../types/employee";

const USER_ROUTE = "/user";

export const getUserBalancePoints = async (
  employeeId: string
): Promise<number> => {
  try {
    const response = await axiosInstance.get(
      `${USER_ROUTE}/points/${employeeId}`
    );
    return response.data?.balance_points || 0;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Recieving balance points failed"
    );
  }
};

export const getCompanyAvgBalancePoints = async (
  companyId: number
): Promise<number> => {
  try {
    const response = await axiosInstance.get(
      `${USER_ROUTE}/points/company/${companyId}`
    );
    return response.data?.avg || 0;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Recieving avg balance points failed"
    );
  }
};

export const getAllCompanyEmployeesData = async (
  companyId: number
): Promise<employeeData[]> => {
  try {
    const response = await axiosInstance.get(
      `${USER_ROUTE}/employees/${companyId}`
    );
    return response.data || [];
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Recieving employees data failed"
    );
  }
};

export const deleteUserById = async (userId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${USER_ROUTE}/${userId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Deleting user failed");
  }
};

export const addNewEmployees = async (
  employees: newEmployee[],
  company_id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${USER_ROUTE}/addNewEmployees`, {
      employees,
      company_id,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Adding new employees failed"
    );
  }
}

export const updateUserFirstLogin = async (
  userId: string,
  password: string,
  city: string
): Promise<any> => {
  try {
    const response = await axiosInstance.put(`${USER_ROUTE}/${userId}/first-login`, {
      password,
      city,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "First login setup failed"
    );
  }
};

export const getAssignedEmployeesAmount = async (companyId: number): Promise<number> => {
  try {
    const response = await axiosInstance.get(`${USER_ROUTE}/assignedAmount/company/${companyId}`);
    return response.data.amount || 0;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Recieving assigned employees amount failed");
  }
};
