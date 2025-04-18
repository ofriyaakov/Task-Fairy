import axiosInstance from "../axiosInstance";

export type Gender = "Male" | "Female" | "Both";

export interface TaskPayload {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  gender: Gender;
  location: string;
  balancePoints: number;
  employeesAmount: number;
  saveToTasks: boolean;
  other: string;
  id?: string;
  companyId: string;
}

const TASK_ROUTE = "/task";
export const createTask = async (payload: TaskPayload) => {
  try {
    const response = await axiosInstance.post(`${TASK_ROUTE}/`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "creation task failed");
  }
};

export const assignEmployees = async (taskId: string, employeeIds: string[]) => {
  try {
    const response = await axiosInstance.post(`${TASK_ROUTE}/assignEmployees`, { taskId, employeeIds });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "failed to assign employees");
  }
};

