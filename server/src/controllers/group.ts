import db from "../config/db";
import type { QueryResult } from "pg";

export const addNewGroup = async (groupName: string, companyId: number, executor: { query: <T = any>(sql: string, params?: any[]) => Promise<QueryResult<T>> } = db) => {
  try {
    const result = await executor.query<{ group_id: number; group_name: string; company_id: number }>(
      `INSERT INTO groups (group_name, company_id) VALUES ($1, $2) RETURNING *`,
      [groupName, companyId]
    );

    console.log("New group added:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding new group:", err);
    throw err;
}
};
