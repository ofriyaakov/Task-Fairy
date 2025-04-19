import db from "../config/db";
import type { QueryResult } from "pg";

export const addNewCompany = async (
  companyName: string,
  executor: {
    query: <T = any>(sql: string, params?: any[]) => Promise<QueryResult<T>>;
  } = db
) => {
  try {
    const result = await executor.query<{
      company_id: number;
      company_name: string;
    }>(`INSERT INTO companies (company_name) VALUES ($1) RETURNING *`, [
      companyName,
    ]);

    console.log("New company added:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding new company:", err);
    throw err;
  }
};
