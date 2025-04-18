export type Gender = "Male" | "Female" | "Both";

export interface Task {
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
  id: string;
  companyId: string;
}
