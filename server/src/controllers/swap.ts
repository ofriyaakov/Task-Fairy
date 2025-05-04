import db from "../config/db";
import { RawSwapRequest } from './../models/swap'

export const getPendingSwapRequests = async (companyId: string) => {
    try {
        const result = await db.query(`
        SELECT first_swap_info.first_user_id,
            first_swap_info.first_user_first_name,
            first_swap_info.first_user_last_name,
            first_swap_info.first_task_name,
            first_swap_info.first_task_start_time,
            first_swap_info.first_task_end_time,
            users.user_id second_user_id, 
            users.first_name second_user_first_name, 
            users.last_name second_user_last_name,
            tasks.name second_task_name,
            tasks.start_time second_task_start_time,
            tasks.end_time second_task_end_time
        FROM (
            SELECT swap_requests.first_r_task_user,
                users.user_id first_user_id, 
                users.first_name first_user_first_name,
                users.last_name first_user_last_name,
                tasks.name first_task_name,
                tasks.start_time first_task_start_time,
                tasks.end_time first_task_end_time,
                swap_requests.second_r_task_user
            FROM public.r_tasks_users
            JOIN public.swap_requests ON swap_requests.first_r_task_user = r_tasks_users.id 
            JOIN public.users ON users.user_id = r_tasks_users.user_id
            JOIN public.tasks ON tasks.task_id = r_tasks_users.task_id
            WHERE status_id = 2) as first_swap_info
        JOIN public.r_tasks_users ON r_tasks_users.id = first_swap_info.second_r_task_user
        JOIN public.swap_requests second_swap ON second_swap.second_r_task_user = first_swap_info.second_r_task_user
        JOIN public.users ON users.user_id = r_tasks_users.user_id
        JOIN public.tasks ON tasks.task_id = r_tasks_users.task_id
        `);

        const swapRequests: RawSwapRequest[] = result.rows;
        const formatedSwapRequests = swapRequests.map((rawSwapRequest) => {
            return {
                leftDetails: {
                    employeeId: rawSwapRequest.first_user_id,
                    employeeFirstName: rawSwapRequest.first_user_first_name,
                    employeeLastName: rawSwapRequest.first_user_last_name,
                    taskName: rawSwapRequest.first_task_name,
                    taskStartTime: rawSwapRequest.first_task_start_time,
                    taskEndTime: rawSwapRequest.first_task_end_time,
                },
                rightDetails: {
                    employeeId: rawSwapRequest.second_user_id,
                    employeeFirstName: rawSwapRequest.second_user_first_name,
                    employeeLastName: rawSwapRequest.second_user_last_name,
                    taskName: rawSwapRequest.second_task_name,
                    taskStartTime: rawSwapRequest.second_task_start_time,
                    taskEndTime: rawSwapRequest.second_task_end_time,
                }
            };
        });
        return formatedSwapRequests;
    } catch (err) {
        console.error(err);
    }
};