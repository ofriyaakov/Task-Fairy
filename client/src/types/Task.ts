export type Gender = "Male" | "Female" | "Both";

export interface Task extends TaskDetails {
  id: string;
  companyId: number;
}

export interface TaskDetails {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  gender: Gender;
  location: string;
  balancePoints: number;
  employeesAmount: number;
  saveToTasks: boolean;
  other: string;
}

export interface TaskPayload extends TaskDetails {
  companyId: number;
}

export type TaskSummaryCard = Pick<
  TaskDetails,
  "name" | "location" | "startTime" | "endTime" | "balancePoints" | "gender"
> & {
  status?: string;
  taskId: string;
};

export interface CalendarTask extends TaskSummaryCard{
  date: string;
  employeesAmount: number;
  assignedEmployeesAmount: number;
}

export type TaskForAi = Pick<Task, "name" | "description" | "companyId">;