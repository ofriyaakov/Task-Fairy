import userModel, { IUser, User } from "../models/user";
import db from "../config/db";
import { QueryResult } from "pg";

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

export const getUserByEmail = async (
  email: IUser["email"]
): Promise<User> => {
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

export const addNewUser = async (user: User, executor: { query: <T = any>(sql: string, params?: any[]) => Promise<QueryResult<T>> } = db) => {
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
      [user.user_id, user.email, user.first_name, user.last_name, user.password, user.user_level, user.phone_number, user.group_id]
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