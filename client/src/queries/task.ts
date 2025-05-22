import axiosInstance from "../axiosInstance";
import {TaskForAi, TaskPayload } from "./../types/Task";

const TASK_ROUTE = "/task";
const GAMINI_ROUTE = "/gemini";
export const createTask = async (payload: TaskPayload) => {
  try {
    const response = await axiosInstance.post(`${TASK_ROUTE}/`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "creation task failed");
  }
};

export const assignEmployees = async (
  taskId: string,
  employeeIds: string[],
  taskDate: Date,
  taskBalancePoints: number
) => {
  try {    
    const response = await axiosInstance.post(`${TASK_ROUTE}/assignEmployees`, {
      taskId,
      employeeIds,
      taskDate,
      taskBalancePoints,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "failed to assign employees"
    );
  }
};

export const getAllSavedTasks = async () => {
  try {
    const savedTasks = (await axiosInstance.get(`${TASK_ROUTE}/saved`)).data;
    return savedTasks;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "fetch saved tasks failed"
    );
  }
};

export const getEmployeeTasks = async (employeeId: string) => {
  try {
    const employeeTasks = (
      await axiosInstance.get(`${TASK_ROUTE}/employee/${employeeId}`)
    ).data;
    return employeeTasks;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "fetch employee tasks failed"
    );
  }
};

export const analyzeTask = async (payload: TaskForAi) => {
  try {
    const response = await axiosInstance.post(
      `${GAMINI_ROUTE}/taskAnalyze`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "analyze task failed");
  }
};

export const getAllTasksByMonth = async (month: number, companyId: number) => {
  try {
    const tasks = (await axiosInstance.get(`${TASK_ROUTE}/month/?month=${month}&companyId=${companyId}`)).data;
    return tasks;
  } catch (error: any) {
    console.error("getAllTasksByMonth error", error);
    throw new Error(error.response?.data?.message || "fetch tasks by month failed");
  }
};

export const getBalancePointsByGroup = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${TASK_ROUTE}/balancePointsByGroup/?companyId=${companyId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "fetch balance points failed"
    );
  }
};

export const getSuggestedEmployees = async (taskId: string) => {
  try {
    const response = await axiosInstance.get(
      `${TASK_ROUTE}/suggestedEmployees/?taskId=${taskId}`
    );
    return response.data;
  }
  catch (error: any) {
    throw new Error(
      error.response?.data?.message || "fetch suggested employees failed"
    );
  }
};

export const getUnassignedTasksAmount = async (companyId: number, month: number): Promise<number> => {
  try {
    const response = await axiosInstance.get(`${TASK_ROUTE}/unassignedTasks/company/${companyId}/month/${month}`);
    return response.data.amount || 0;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Recieving unassigned tasks amount failed");
  }
};
