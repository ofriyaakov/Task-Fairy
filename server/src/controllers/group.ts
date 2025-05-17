import db from "../config/db";
import type { QueryResult } from "pg";

export const addNewGroup = async (
  groupName: string,
  companyId: number,
  executor: {
    query: <T = any>(sql: string, params?: any[]) => Promise<QueryResult<T>>;
  } = db
) => {
  try {
    const result = await executor.query<{
      group_id: number;
      group_name: string;
      company_id: number;
    }>(
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

export const getGroupByNameAndCompany = async (
  groupName: string,
  companyId: number,
  executor: {
    query: <T = any>(sql: string, params?: any[]) => Promise<QueryResult<T>>;
  } = db
) => {
  const sql = `
    SELECT g.group_id, g.group_name, g.company_id
    FROM groups g
    WHERE g.group_name = $1 AND g.company_id = $2
    LIMIT 1
  `;

  try {
    const result = await executor.query(sql, [groupName, companyId]);
    if (result.rows.length === 0) {
      console.log("Group not found");
      return null;
    }

    const group = result.rows[0];
    console.log("get group by name and company success:", group);
    return group;
  } catch (err) {
    console.error("getGroupByNameAndCompany error:", err);
    throw new Error("DB error while fetching group");
  }
};
