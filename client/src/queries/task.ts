import axiosInstance from "../axiosInstance";

const TASK_ROUTE = "/task";
export const assignEmployees = async (taskId: string, employeeIds: string[]) => {
    try {
        const response = await axiosInstance.post(`${TASK_ROUTE}/assignEmployees`, { taskId, employeeIds });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "failed to assign employees");
    }
};