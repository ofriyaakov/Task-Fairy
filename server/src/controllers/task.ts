import db from "../config/db";
import { Task, RawTask, RawTaskWithUserId } from "../models/task";
import { getUserGroupId } from "./user";

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

export const getBalancePointsByGroupForCurrentMonth = async (
  groupId: number
) => {
  try {
    const result = await db.query(
      `SELECT tasks.*, users.user_id
       FROM public.tasks
       INNER JOIN public.r_tasks_users ON tasks.task_id = r_tasks_users.task_id
       INNER JOIN public.users ON r_tasks_users.user_id = users.user_id
       AND users.group_id = $1
       WHERE tasks.date::timestamp >= date_trunc('month', current_date)
       AND tasks.date::timestamp < date_trunc('month', current_date) + interval '1 month'
       `,
      [groupId]
    );

    const tasks: RawTaskWithUserId[] = result.rows;

    //I want to get the amount of people in the group
    const groupUsers = await db.query(
      `SELECT * FROM public.users WHERE group_id = $1`,
      [groupId]
    );
    const users: { user_id: string }[] = groupUsers.rows;
    const usersAmount = users.length;

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
    const minBalancePoints = Math.min(...balancePointsArray);
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
