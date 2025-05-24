import userModel, { IUser, User, employeeData } from "../models/user";
import db from "../config/db";
import { QueryResult } from "pg";
import e from "express";

export const getAllUsers = async () => {
  try {
    const result = await db.query("SELECT * FROM users");
    const users: User[] = result.rows;
    console.log("get all user success:", users);
    return users;
  } catch (err) {
    console.error(err);
  }
};

export const getUserById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }
    const user: User = result.rows[0];
    console.log("get user by id success:", user);
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("User not found");
  }
};

export const getUserByEmail = async (email: IUser["email"]): Promise<User> => {
  const sql = `
    SELECT 
      u.*,
      g.company_id,
      g.group_name
    FROM users   u
    JOIN groups  g ON u.group_id = g.group_id
    WHERE u.email = $1
    LIMIT 1
  `;

  try {
    const result = await db.query(sql, [email]);
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const userWithCompany: User = result.rows[0];
    console.log("get user by email success:", userWithCompany);
    return userWithCompany;
  } catch (err) {
    console.error("getUserByEmail error:", err);
    throw new Error("User not found");
  }
};

// export const addNewUser = (user: User) => userModel.create(user);

export const addNewUser = async (
  user: User,
  executor: {
    query: <T = any>(sql: string, params?: any[]) => Promise<QueryResult<T>>;
  } = db
) => {
  try {
    const result = await executor.query<{
      user_id: string;
      email: string;
      first_name: string;
      last_name: string;
      password: string;
      user_level: number;
      phone_number: string;
      group_id: number;
    }>(
      `INSERT INTO users (user_id, email, first_name, last_name, password, user_level, phone_number, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        user.user_id,
        user.email,
        user.first_name,
        user.last_name,
        user.password,
        user.user_level,
        user.phone_number,
        user.group_id,
      ]
    );

    console.log("New user added:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding new user:", err);
    throw err;
  }
};

export const updateUserById = (
  id,
  { name }: Omit<IUser, "password" | "email" | "tokens">
) => {
  userModel.findByIdAndUpdate(id, { name }, { new: true });
};

// export const updateUserTokenById = (id, newRefreshToken) =>
//   userModel.findByIdAndUpdate(id, { tokens: newRefreshToken }, { new: true });

export const updateUserTokenById = async (id: string, newRefreshToken: any) => {
  try {
    const result = await db.query(
      `UPDATE users SET tokens = $1 WHERE user_id = $2 RETURNING *`,
      [newRefreshToken, id]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user: User = result.rows[0];

    console.log("User token updated:", user);
    return user;
  } catch (err) {
    console.error("Error updating user token:", err);
    throw err;
  }
};

export const increaseHolidayCountForUser = async (employeeIds: string[]) => {
  try {
    const query = `UPDATE users SET holiday_count = holiday_count + 1 WHERE user_id = $1 RETURNING *`;

    const returnRows = [];

    employeeIds.forEach(async (id) => {
      const { rows } = await db.query(query, [id]);
      returnRows.push(rows);
    });

    console.log("User holiday raised:", returnRows);
    return returnRows;
  } catch (err) {
    console.error("Error raising holiday for user:", err);
    throw err;
  }
};

export const decreaseHolidayCountForUser = async (employeeIds: string[]) => {
  try {
    const query = `UPDATE users SET holiday_count = holiday_count - 1 WHERE user_id = $1 RETURNING *`;

    const returnRows = [];

    employeeIds.forEach(async (id) => {
      const { rows } = await db.query(query, [id]);
      returnRows.push(rows);
    });

    console.log("User holiday lowered:", returnRows);
    return returnRows;
  } catch (err) {
    console.error("Error lowering holiday for user:", err);
    throw err;
  }
};

export const getAllEmployeesByCompanyIdAndGender = async (
  companyId: string,
  gender: string
) => {
  try {
    let query = `
      SELECT u.*, g.group_name, g.company_id
      FROM users u
      JOIN groups g ON u.group_id = g.group_id
      WHERE g.company_id = $1
      AND u.user_level = 1
    `;

    if (gender !== "Both") {
      query += ` AND u.gender = $2`;
    }

    const { rows } = await db.query(
      query,
      gender === "Both" ? [companyId] : [companyId, gender]
    );
    console.log("get all employees by company id success:", rows);
    return rows;
  } catch (err) {
    console.error("Error getting employees by company id:", err);
    throw err;
  }
};

export const increaseBalancePointsForUsers = async (
  employeeIds: string[],
  balancePoints: number
) => {
  try {
    const query = `UPDATE users SET balance_points = balance_points + $1 WHERE user_id = $2 RETURNING *`;

    const returnRows = [];

    employeeIds.forEach(async (id) => {
      const { rows } = await db.query(query, [balancePoints, id]);
      returnRows.push(rows);
    });

    console.log("User balance points raised:", returnRows);
    return returnRows;
  } catch (err) {
    console.error("Error raising balance points for user:", err);
    throw err;
  }
};

export const getUserBalancePointsById = async (employeeId: string) => {
  try {
    const result = await db.query(
      "SELECT balance_points FROM users WHERE user_id = $1",
      [employeeId]
    );
    if (result.rows.length === 0) {
      throw new Error("User not found 1");
    }
    const balancePoints: number = result.rows[0];
    return balancePoints;
  } catch (err) {
    console.error(err);
    throw new Error("User not found 2");
  }
};

export const getAvgBalancePointsByCompany = async (companyId: number) => {
  try {
    const result = await db.query(
      `SELECT AVG(users.balance_points)
       FROM public.users as users
       INNER JOIN public.groups as gr
        ON users.group_id = gr.group_id
       INNER JOIN public.companies as company
        ON gr.company_id = company.company_id
       WHERE company.company_id = $1`,
      [companyId]
    );

    const companyAvg: number = result.rows[0];
    return companyAvg;
  } catch (err) {
    console.error(err);
  }
};

export const getAllCompanyEmployeesData = async (companyId: number) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT u.user_id, u.first_name, u.last_name, u.email, g.group_name, u.balance_points, t.start_time AS last_task_date
       FROM public.users as u
       INNER JOIN public.groups as g
       ON u.group_id = g.group_id
       LEFT JOIN public.r_tasks_users as ru
       ON ru.user_id = u.user_id
       LEFT JOIN public.tasks as t
       ON t.task_id = ru.task_id
       AND t.start_time = 
        (SELECT MAX(start_time) FROM public.tasks AS t2
         INNER JOIN public.r_tasks_users as ru2
         ON ru2.user_id = u.user_id
         AND ru2.task_id = t2.task_id)`
    );

    const emplyeesData: employeeData[] = result.rows;
    return emplyeesData.filter(
      (employee, index, self) =>
        index === self.findIndex((e) => e.user_id === employee.user_id)
    );
  } catch (err) {
    console.error(err);
  }
};

export const removeUserById = async (id: string) => {
  try {
    const result = await db.query(
      `UPDATE public.users SET group_id = NULL WHERE user_id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    await db.query(
      `DELETE FROM public.swap_requests AS s
      USING public.r_tasks_users AS r
      WHERE r.user_id = $1
      AND (s.first_r_task_user = r.id OR s.second_r_task_user = r.id);`,
      [id]
    );

    await db.query(
      `DELETE FROM public.r_tasks_users AS r
       USING public.tasks AS t
       WHERE r.task_id = t.task_id
       AND r.user_id = $1
       AND t.start_time > NOW() - INTERVAL '1 hour';`,
      [id]
    );
  } catch (err) {
    console.error(err);
    throw new Error("User not found");
  }
};
