import db from "../config/db";
import { Task } from "../models/task";

export const createTask = async (task: Task) => {
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
    creatorId,
  }: Task = task;

  const query = `
        INSERT INTO tasks (name, description, date, start_time, end_time, gender, location, balance_points, employees_amount, save_to_tasks, other, creator, created_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
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
    creatorId,
  ];
  const { rows } = await db.query(query, values);

  console.log("ans", rows[0]);
  return rows[0];
};
