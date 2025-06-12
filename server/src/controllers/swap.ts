import db from "../config/db";
import { RawSwapRequest, SwapRequestPayload, RawFullSwapRequest } from './../models/swap'

export const getPendingSwapRequests = async (companyId: number) => {
  try {
    const result = await db.query(
      `
        SELECT first_swap_info.id as swap_request_id,
            first_swap_info.first_user_id,
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
            SELECT  swap_requests.id,
                swap_requests.first_r_task_user,
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
            WHERE status_id = 2 and tasks.company_id = $1) as first_swap_info
        JOIN public.r_tasks_users ON r_tasks_users.id = first_swap_info.second_r_task_user
        JOIN public.users ON users.user_id = r_tasks_users.user_id
        JOIN public.tasks ON tasks.task_id = r_tasks_users.task_id
        `,
      [companyId]
    );

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
        },
        swapRequestId: rawSwapRequest.swap_request_id,
      };
    });
    return formatedSwapRequests;
  } catch (err) {
    console.error(err);
  }
};

export const getSwapRequestAmount = async (companyId: number) => {
  try {
    const result = await db.query(
      `
       SELECT COUNT(swap_requests.id) as amount
        FROM public.swap_requests
        JOIN public.r_tasks_users ON (r_tasks_users.id = swap_requests.first_r_task_user OR
            r_tasks_users.id = swap_requests.second_r_task_user)
        JOIN public.tasks ON tasks.task_id = r_tasks_users.task_id
        WHERE tasks.company_id = $1 AND EXTRACT(MONTH FROM CAST(tasks.start_time as DATE)) = EXTRACT(MONTH FROM CAST(current_date as DATE))
        `,
      [companyId]
    );

      const amount: number = result.rows[0];
      return amount;
  
    } catch (err) {
      console.error(err);
    }
};

export const addSwapRequest = async (swapRequest: SwapRequestPayload) => {
    try {
        const { requestingTaskId, requestingUserId, requestedTaskId, requestedUserId, date } = swapRequest;

        const result = await db.query(
            `INSERT INTO swap_requests
            (first_r_task_user,second_r_task_user, status_id, creation_date)
            SELECT (SELECT rtu.id 
		            FROM r_tasks_users as rtu
		            WHERE task_id = $1 AND user_id = $2),
		            (SELECT rtu.id 
		            FROM r_tasks_users as rtu
		            WHERE task_id = $3 AND user_id = $4),
		            2, $5
            RETURNING *`,
        [requestingTaskId, requestingUserId, requestedTaskId, requestedUserId, date]
        )

        if (result.rows.length === 0) {
            throw new Error("An error occurred while adding the swap request");
        }

        return result.rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const updateSwapRequestStatus = async (
  swapId: string,
  status: number
) => {
  try {
    const result = await db.query(
      `
        UPDATE public.swap_requests 
        SET status_id = $1
        WHERE id = $2;`,
      [status, swapId]
    );

    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
};

export const getSwapRequestsByEmployee = async (employeeId: string) => {
    try {
      const result = await db.query(`
        SELECT
            first_swap_info.first_user_id,
            first_swap_info.first_user_first_name,
            first_swap_info.first_user_last_name,
            first_swap_info.first_task_name,
            first_swap_info.first_task_start_time,
            first_swap_info.first_task_end_time,
            first_swap_info.first_task_id,
            users.user_id second_user_id, 
            users.first_name second_user_first_name, 
            users.last_name second_user_last_name,
            tasks.name second_task_name,
            tasks.start_time second_task_start_time,
            tasks.end_time second_task_end_time,
            tasks.task_id second_task_id,
            swap_status.status_name status
        FROM (SELECT DISTINCT(swap_requests.id) swap_request_id,
            swap_requests.first_r_task_user,
            users.user_id first_user_id, 
            users.first_name first_user_first_name,
            users.last_name first_user_last_name,
            tasks.name first_task_name,
            tasks.start_time first_task_start_time,
            tasks.end_time first_task_end_time,
            tasks.task_id first_task_id,
            swap_requests.second_r_task_user,
            swap_requests.status_id
            FROM public.r_tasks_users
            JOIN public.swap_requests ON swap_requests.first_r_task_user = r_tasks_users.id 
            JOIN public.users ON users.user_id = r_tasks_users.user_id
            JOIN public.tasks ON tasks.task_id = r_tasks_users.task_id
            ) as first_swap_info
        JOIN public.r_tasks_users ON r_tasks_users.id = first_swap_info.second_r_task_user
        JOIN public.users ON users.user_id = r_tasks_users.user_id
        JOIN public.tasks ON tasks.task_id = r_tasks_users.task_id
        JOIN public.swap_status ON first_swap_info.status_id = swap_status.status_id
        WHERE first_swap_info.first_user_id = $1 or users.user_id = $1
       `, [employeeId]
      );

      const employeeSwapRequests: RawFullSwapRequest[] = result.rows;

        const formatedEmployeeSwapRequests = employeeSwapRequests.map((rawSwapRequest) => {
            return {
                leftDetails: {
                    employeeId: rawSwapRequest.first_user_id,
                    employeeFirstName: rawSwapRequest.first_user_first_name,
                    employeeLastName: rawSwapRequest.first_user_last_name,
                    taskName: rawSwapRequest.first_task_name,
                    taskStartTime: rawSwapRequest.first_task_start_time,
                    taskEndTime: rawSwapRequest.first_task_end_time,
                    taskId: rawSwapRequest.first_task_id,
                },
                rightDetails: {
                    employeeId: rawSwapRequest.second_user_id,
                    employeeFirstName: rawSwapRequest.second_user_first_name,
                    employeeLastName: rawSwapRequest.second_user_last_name,
                    taskName: rawSwapRequest.second_task_name,
                    taskStartTime: rawSwapRequest.second_task_start_time,
                    taskEndTime: rawSwapRequest.second_task_end_time,
                    taskId: rawSwapRequest.second_task_id,
                },
                status: rawSwapRequest.status
            };
        });
        return formatedEmployeeSwapRequests;

    } catch (err) {
      console.error(err);
    }
};