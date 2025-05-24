export interface employeeDatailsCard {
    first_name: string;
    last_name: string;
    user_id: string;
    company_name: string;
    city: string
    balance_points: number;
    gender: string;
    score: number;
    group_name: string;
}

export interface employeeData {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    group_name: string;
    balance_points: number;
    last_task_date: Date | string | null;
}