import axiosInstance from "../axiosInstance";
import { TaskForAi, TaskPayload } from './../types/Task';

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

export const getAllSavedTasks = async () => {
  try {
    const savedTasks = (await axiosInstance.get(`${TASK_ROUTE}/saved`)).data;
    return savedTasks;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "fetch saved tasks failed");
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

export const getBalancePointsByGroup = async (groupId: string) => {
  try {
    const response = await axiosInstance.get(
      `${TASK_ROUTE}/balancePointsByGroup/?groupId=${groupId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "fetch balance points failed"
    );
  }
};

