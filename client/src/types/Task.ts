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

export type ShortenedTaskDetails = Pick<
  TaskDetails,
  "name" | "location" | "startTime" | "endTime" | "balancePoints" | "gender" 
> & {
  taskId: string;
};

export type TaskSummaryCard = ShortenedTaskDetails & {
  status?: string;
};

export interface CalendarTask extends ShortenedTaskDetails {
  date: string;
  employeesAmount: number;
  isAssignedToCurrentUser: boolean;
  assignedEmployeesAmount: number;
}

export type TaskForAi = Pick<Task, "name" | "description" | "companyId">;