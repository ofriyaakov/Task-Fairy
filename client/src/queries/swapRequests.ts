import axiosInstance from "../axiosInstance";
import { SwapRequestPayload } from "../types/Swap";

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