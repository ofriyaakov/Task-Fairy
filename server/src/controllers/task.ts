import db from "../config/db";
import { Task } from "../models/task";

export const createTask = async (task: Task) => {
  try {
    const {
      name,
      description,
      date,
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
        INSERT INTO tasks (name, description, date, start_time, end_time, gender, location, balance_points, employees_amount, save_to_tasks, other, company_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

    const values = [
      name,
      description,
      date,
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

export const assignEmployees = async (taskId: string, employeeIds: string[]) => {
  try {
    const query = `
        INSERT INTO public.r_tasks_users(task_id, user_id)
	    VALUES ($1, $2)
        RETURNING *
      `;

    const returnRows = []

    employeeIds.forEach(async (id) => {
      const { rows } = await db.query(query, [taskId, id]);
      returnRows.push(rows)
    })

    return returnRows;
  } catch (e) {
    console.error(e);
  }
};