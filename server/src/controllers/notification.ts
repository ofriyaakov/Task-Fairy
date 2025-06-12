import db from "../config/db";

export const getUserNotifications = async (userId: string) => {
  const result = await db.query(
    `SELECT id, type, message, is_read, created_at
     FROM notifications
     WHERE user_id = $1
       AND (
         is_read = false
         OR created_at >= NOW() - INTERVAL '1 day'
       )
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const markNotificationsAsRead = async (userId: string) => {
  const result = await db.query(
    `UPDATE notifications
     SET is_read = true
     WHERE user_id = $1 AND is_read = false
     RETURNING *`,
    [userId]
  );
  return result.rows;
};
