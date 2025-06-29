import db from "../config/db";
import {
  RawSwapRequest,
  SwapRequestPayload,
  RawFullSwapRequest,
  SwapRequestStatus,
} from "./../models/swap";

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
    const {
      requestingTaskId,
      requestingUserId,
      requestedTaskId,
      requestedUserId,
      date,
    } = swapRequest;

    const result = await db.query(
      `INSERT INTO swap_requests
        (first_r_task_user, second_r_task_user, status_id, creation_date)
        SELECT 
          (SELECT rtu.id FROM r_tasks_users rtu WHERE task_id = $1 AND user_id = $2),
          (SELECT rtu.id FROM r_tasks_users rtu WHERE task_id = $3 AND user_id = $4),
          2, $5
        RETURNING *`,
      [
        requestingTaskId,
        requestingUserId,
        requestedTaskId,
        requestedUserId,
        date,
      ]
    );

    if (result.rows.length === 0) {
      throw new Error("An error occurred while adding the swap request");
    }

    // Find all managers (level = 2) in the same company as requesting user
    const managerRes = await db.query(
      `
      SELECT u.user_id
      FROM users u
      JOIN groups g ON u.group_id = g.group_id
      WHERE g.company_id = (
        SELECT g2.company_id
        FROM users u2
        JOIN groups g2 ON u2.group_id = g2.group_id
        WHERE u2.user_id = $1
      )
      AND u.user_level = 2
      `,
      [requestingUserId]
    );

    for (const row of managerRes.rows) {
      await db.query(
        `INSERT INTO notifications (user_id, type, message)
         VALUES ($1, 'SWAP_REQUEST', $2)`,
        [row.user_id, `A new swap request was submitted.`]
      );
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
      WHERE id = $2
      RETURNING first_r_task_user;`,
      [status, swapId]
    );

    if (status == SwapRequestStatus.Approved) {
      await approveSwap(swapId);
    }
    const firstRTaskUserId = result.rows[0]?.first_r_task_user;

    if (!firstRTaskUserId) return;

    const { rows: userRes } = await db.query(
      `SELECT user_id FROM r_tasks_users WHERE id = $1`,
      [firstRTaskUserId]
    );

    const requestingUserId = userRes[0]?.user_id;
    if (!requestingUserId) return;

    const statusText = status === 1 ? "approved" : "declined";

    // Notify requesting user
    await db.query(
      `INSERT INTO notifications (user_id, type, message)
       VALUES ($1, 'SWAP_DECISION', $2)`,
      [requestingUserId, `Your swap request was ${statusText}.`]
    );

    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
};
const approveSwap = async (swapId: string) => {
  const { rows } = await db.query(
    `
      SELECT
        sr.first_r_task_user,
        sr.second_r_task_user,

        rt1.user_id AS first_user_id,
        rt2.user_id AS second_user_id,

        rt1.task_id AS first_task_id,
        rt2.task_id AS second_task_id,

        t1.balance_points AS first_task_points,
        t2.balance_points AS second_task_points,

        u1.balance_points AS first_user_points,
        u2.balance_points AS second_user_points

      FROM swap_requests sr
      JOIN r_tasks_users rt1 ON sr.first_r_task_user = rt1.id
      JOIN r_tasks_users rt2 ON sr.second_r_task_user = rt2.id

      JOIN tasks t1 ON rt1.task_id = t1.task_id
      JOIN tasks t2 ON rt2.task_id = t2.task_id

      JOIN users u1 ON rt1.user_id = u1.user_id
      JOIN users u2 ON rt2.user_id = u2.user_id

      WHERE sr.id = $1
      `,
    [swapId]
  );

  if (!rows.length) throw new Error("Swap request not found");

  const {
    first_r_task_user: firstRTaskUserId,
    second_r_task_user: secondRTaskUserId,
    first_user_id: firstUserId,
    second_user_id: secondUserId,
    first_task_id: firstTaskId,
    second_task_id: secondTaskId,
    first_task_points: firstTaskPoints,
    second_task_points: secondTaskPoints,
    first_user_points: firstUserPoints,
    second_user_points: secondUserPoints,
  } = rows[0];

  const updatedFirstUserPoints =
    firstUserPoints - firstTaskPoints + secondTaskPoints;
  const updatedSecondUserPoints =
    secondUserPoints - secondTaskPoints + firstTaskPoints;

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // 1. Swap the users on the r_tasks_users table
    await client.query(
      `
      UPDATE r_tasks_users
      SET user_id = CASE
        WHEN id = $1 THEN $3
        WHEN id = $2 THEN $4
      END
      WHERE id IN ($1, $2)
      `,
      [firstRTaskUserId, secondRTaskUserId, secondUserId, firstUserId]
    );

    // 2. Update users' balance points
    await client.query(
      `
      UPDATE users
      SET balance_points = CASE
        WHEN user_id = $1 THEN CAST($3 AS INTEGER)
        WHEN user_id = $2 THEN CAST($4 AS INTEGER)
      END
      WHERE user_id IN ($1, $2)
      `,
      [
        firstUserId,
        secondUserId,
        updatedFirstUserPoints,
        updatedSecondUserPoints,
      ]
    );

    //3. Delete all other swap requests that involve the same task-user
    await db.query(
      `UPDATE swap_requests 
        SET status_id = 3 
        WHERE first_r_task_user = $1 
        AND status_id = 2`,
      [firstRTaskUserId]
    );

    await client.query("COMMIT");
    return { success: true };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const getSwapRequestsByEmployee = async (employeeId: string) => {
  try {
    const result = await db.query(
      `
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
       `,
      [employeeId]
    );

    const employeeSwapRequests: RawFullSwapRequest[] = result.rows;

    const formatedEmployeeSwapRequests = employeeSwapRequests.map(
      (rawSwapRequest) => {
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
          status: rawSwapRequest.status,
        };
      }
    );
    return formatedEmployeeSwapRequests;
  } catch (err) {
    console.error(err);
  }
};
