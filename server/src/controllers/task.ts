import db from "../config/db";
import { Task, RawTask } from "../models/task";

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
