import db from "../config/db";
import { Task, RawTask, RawEmployeedTask, RawTaskWithUserId } from "../models/task";

export const createTask = async (task: Task) => {
  try {
    const {
      name,
      description,
      startTime,
      endTime,
      gender,
      location,
      balancePoints,
      employeesAmount,
      saveToTasks,
      other,
      companyId,
    }: Task = task;

    const query = `
        INSERT INTO tasks (name, description, start_time, end_time, gender, location, balance_points, employees_amount, save_to_tasks, other, company_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

    const values = [
      name,
      description,
      startTime,
      endTime,
      gender,
      location,
      balancePoints,
      employeesAmount,
      saveToTasks,
      other,
      companyId,
    ];
    const { rows } = await db.query(query, values);

    return rows[0];
  } catch (e) {
    console.error(e);
  }
};

export const assignEmployees = async (
  taskId: string,
  employeeIds: string[]
) => {
  try {
    const query = `
        INSERT INTO public.r_tasks_users(task_id, user_id)
	    VALUES ($1, $2)
        RETURNING *
      `;

    const returnRows = [];

    employeeIds.forEach(async (id) => {
      const { rows } = await db.query(query, [taskId, id]);
      returnRows.push(rows);
    });

    return returnRows;
  } catch (e) {
    console.error(e);
  }
};
export const getAllSavedTasks = async () => {
  try {
    const result = await db.query(`
      SELECT * FROM public.tasks 
      WHERE save_to_tasks`);

    const savedTasks: RawTask[] = result.rows;

    const formatedSavedTasks = savedTasks.map((task) => {
      return {
        name: task.name,
        location: task.location,
        startTime: task.start_time,
        endTime: task.end_time,
        balancePoints: task.balance_points,
        gender: task.gender,
      };
    });

    return formatedSavedTasks;
  } catch (err) {
    console.error(err);
  }
};

export const getTasksByEmployeeId = async (employeeId: string) => {
  try {
    const result = await db.query(
      `SELECT t.* FROM public.tasks t
       JOIN public.r_tasks_users rtu ON t.task_id = rtu.task_id
       WHERE rtu.user_id = $1`,
      [employeeId]
    );

    const savedTasks = result.rows;

    const formattedTasks = savedTasks.map((task) => ({
      name: task.name,
      location: task.location,
      startTime: task.start_time,
      endTime: task.end_time,
      balancePoints: task.balance_points,
      gender: task.gender,
    }));

    return formattedTasks;
  } catch (err) {
    console.error(err);
  }
};

export const getAllTasksBalancePoints = async (companyId: string) => {
  try {
    const result = await db.query(
      `
        SELECT * FROM public.tasks 
        WHERE company_id = $1`,
      [companyId]
    );

    const tasks: RawTask[] = result.rows;
    const formatedTasks = tasks.map((task) => {
      return {
        name: task.name,
        balancePoints: task.balance_points,
      };
    });
    return formatedTasks;
  } catch (err) {
    console.error(err);
  }
};

export const getAllTasksByMonth = async (month: number, companyId: number) => {
  try {
    const result = await db.query(`
      SELECT tasks.*,
       TO_CHAR(start_time AT TIME ZONE 'Asia/Jerusalem', 'YYYY-MM-DD') as date,
       COUNT(userTask.user_id) as assigned_employees_amount
      FROM public.tasks as tasks
      Left Join public.r_tasks_users as userTask
	      ON userTask.task_id = tasks.task_id
      WHERE EXTRACT(MONTH FROM CAST(start_time as DATE)) = $1
      AND company_id = $2
      GROUP BY tasks.task_id`, 
      [month, companyId]);

    const tasks: RawEmployeedTask[] = result.rows;

    const formatedTasks = tasks.map((task) => {
      return {
        name: task.name,
        location: task.location,
        startTime: task.start_time,
        endTime: task.end_time,
        balancePoints: task.balance_points,
        gender: task.gender,
        taskId: task.task_id,
        date: task.date,
        employeesAmount: task.employees_amount,
        assignedEmployeesAmount: Number(task.assigned_employees_amount),
      };
    });

    return formatedTasks;

  } catch (err) {
    console.error(err);
  }
};

export const getBalancePointsByGroupForCurrentMonth = async (
  companyId: number
) => {
  try {
    const result = await db.query(
      `SELECT tasks.*, users.user_id
       FROM public.tasks
       INNER JOIN public.r_tasks_users ON tasks.task_id = r_tasks_users.task_id
       INNER JOIN public.users ON r_tasks_users.user_id = users.user_id
       INNER JOIN public.groups ON users.group_id = groups.group_id AND groups.company_id = $1
       WHERE tasks.start_time >= date_trunc('month', current_date)
       AND tasks.start_time < date_trunc('month', current_date) + interval '1 month'
       `,
      [companyId]
    );

    const tasks: RawTaskWithUserId[] = result.rows;

    const usersAmountData = await db.query(
      `SELECT COUNT(*) FROM public.users 
      INNER JOIN public.groups ON users.group_id = groups.group_id
      AND groups.company_id = $1`,
      [companyId]
    );

    const usersAmount = parseInt(usersAmountData.rows[0].count, 10);

    const balancePointsByUser: { [key: string]: number } = {};
    tasks.forEach((task) => {
      const userId = task.user_id;
      const balancePoints = task.balance_points;

      if (balancePointsByUser[userId]) {
        balancePointsByUser[userId] += balancePoints;
      } else {
        balancePointsByUser[userId] = balancePoints;
      }
    });
    const balancePointsArray = Object.values(balancePointsByUser);

    const maxBalancePoints = Math.max(...balancePointsArray);
    let minBalancePoints = 0;
    if (balancePointsByUser.length === usersAmount) {
      minBalancePoints = Math.min(...balancePointsArray);
    }
    const avgBalancePoints =
      balancePointsArray.reduce((acc, val) => acc + val, 0) / usersAmount || 0;

    return {
      max: maxBalancePoints,
      min: minBalancePoints,
      avg: avgBalancePoints,
    };
  } catch (err) {
    console.error(err);
  }
};
