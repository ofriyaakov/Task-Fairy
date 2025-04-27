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

export interface TaskDetailsCard {
    name: string;
    location: string;
    startTime: string;
    endTime: string;
    balancePoints: number;
    gender: Gender;
}

export interface CalendarTask extends TaskDetailsCard{
    taskId: string;
    date: string;
    employeesAmount: number;
    assignedEmployeesAmount: number;
}

export interface TaskForAi {
    name: string;
    description: string;
    companyId: string;
}