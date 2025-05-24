import axiosInstance from "../axiosInstance";

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

export const getSwapRequestAmount = async (companyId: number, month: number): Promise<number> => {
    try {
      const response = await axiosInstance.get(`${SWAP_REQUESTS_ROUTE}/amount/company/${companyId}/month/${month}`);
      return response.data.amount || 0;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Recieving swap request amount failed");
    }
  };