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

export interface RawTask {
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  gender: Gender;
  location: string;
  balance_points: number;
  employees_amount: number;
  save_to_tasks: boolean;
  other: string;
  id: string;
  company_id: string;
}

export interface RawEmployeedTask {
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  gender: Gender;
  location: string;
  balance_points: number;
  employees_amount: number;
  save_to_tasks: boolean;
  other: string;
  task_id: string;
  company_id: string;
  assigned_employees_amount: number
}
