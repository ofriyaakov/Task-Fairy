import express, { Request, Response } from "express";
import authenticateToken from "../middleware/jwt";
import {
  getUserNotifications,
  markNotificationsAsRead,
} from "../controllers/notification";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: notifications
 *   description: The Notifications API
 */

router.use(authenticateToken);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags: [notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *       401:
 *         description: Unauthorized
 */
router.get("/", async (req: Request, res: Response) => {
  const userId = req.query.user_id as string;

  try {
    const notifications = await getUserNotifications(userId);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

/**
 * @swagger
 * /notifications/mark-read:
 *   patch:
 *     summary: Mark all unread notifications as read
 *     tags: [notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.patch("/mark-read", async (req: Request, res: Response) => {
  const { user_id } = req.body;

  try {
    const updated = await markNotificationsAsRead(user_id);
    res.status(200).json({ message: "Marked as read", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

export default router;
