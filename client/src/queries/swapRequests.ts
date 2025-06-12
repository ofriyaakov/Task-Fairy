import axiosInstance from "../axiosInstance";
import { SwapRequestPayload, SwapRequestStatus } from "../types/Swap";
const SWAP_REQUESTS_ROUTE = "/swap-requests";

export const getAllPendingSwapRequests = async (companyId: number) => {
    try {
        const pendingSwapRequest = (await axiosInstance.get(`${SWAP_REQUESTS_ROUTE}/pending?companyId=${companyId}`)).data;
        return pendingSwapRequest;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "fetch pending swap requests failed"
        );
    }
};

export const getSwapRequestAmount = async (companyId: number): Promise<number> => {
    try {
      const response = await axiosInstance.get(`${SWAP_REQUESTS_ROUTE}/amount/company/${companyId}`);
      return response.data.amount || 0;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Recieving swap request amount failed");
    }
  };

export const updateSwapRequestStatus = async (
  swapId: string,
  status: SwapRequestStatus
): Promise<number> => {
  try {
    const response = await axiosInstance.post(
      `${SWAP_REQUESTS_ROUTE}/${swapId}/status`,
      { status }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Recieving swap request amount failed"
    );
  }
};

export const createNewSwapRequest = async (swapRequest: SwapRequestPayload) => {
    try {
        const newSwapRequest = (await axiosInstance.post(`${SWAP_REQUESTS_ROUTE}`, { swapRequest })).data;
        return newSwapRequest;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "create swap request failed"
        );
    }
}

export const getSwapRequestsByEmployee = async (employeeId: string) => {
    try {
      const response = (await axiosInstance.get(`${SWAP_REQUESTS_ROUTE}/${employeeId}`)).data;
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Recieving swap requests by employee failed");
    }
};