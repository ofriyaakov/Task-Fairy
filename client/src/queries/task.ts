import axiosInstance from "../axiosInstance";
import { TaskPayload } from './../types/Task';

const TASK_ROUTE = "/task";
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
