import axiosInstance from "../axiosInstance";

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
