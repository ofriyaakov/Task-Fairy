import db from "../config/db";

export const addNewCompany = async (companyName: string) => {
  try {
    const result = await db.query(
      `INSERT INTO companier (company_name) VALUES ($1) RETURNING *`,
      [companyName]
    );

    console.log("New company added:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding new company:", err);
    throw err;
}
};
