import axiosInstance from "../axiosInstance";
import { newEmployee } from "../types/employee";

const USER_ROUTE = "/user";

export const getUserBalancePoints = async (employeeId: string): Promise<number> => {
  try {
    const response = await axiosInstance.get(`${USER_ROUTE}/points/${employeeId}`);
    return response.data?.balance_points || 0;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Recieving balance points failed");
  }
};

export const getCompanyAvgBalancePoints = async (companyId: number): Promise<number> => {
    try {
      const response = await axiosInstance.get(`${USER_ROUTE}/points/company/${companyId}`);
      return response.data?.avg || 0;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Recieving avg balance points failed");
    }
  };

export const addNewEmployees = async (employees: newEmployee[], company_id: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${USER_ROUTE}/addNewEmployees`, { employees, company_id });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Adding new employees failed");
  }
}

export const getAssignedEmployeesAmount = async (companyId: number, month: number): Promise<number> => {
  try {
    const response = await axiosInstance.get(`${USER_ROUTE}/assignedAmount/company/${companyId}/month/${month}`);
    console.log('response.data', response.data.amount)
    return response.data.amount || 0;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Recieving assigned employees amount failed");
  }
};
