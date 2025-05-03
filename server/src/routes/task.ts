import express, { Request, Response } from "express";

import authenticateToken from "../middleware/jwt";
import {
  createTask,
  getAllSavedTasks,
  getBalancePointsByGroupForCurrentMonth,
} from "../controllers/task";

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *  name: Task
 *  description: The Task API
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *       Task:
 *          type: object
 *          required:
 *              - name
 *              - date
 *              - startTime
 *              - endTime
 *              - location
 *          properties:
 *              name:
 *                  type: string
 *                  description: The task name
 *              description:
 *                  type: string
 *                  description: The task description
 *              date:
 *                  type: string
 *                  format: date
 *                  description: The date of the task
 *              startTime:
 *                  type: string
 *                  format: date-time
 *                  description: The start time of the task
 *              endTime:
 *                  type: string
 *                  format: date-time
 *                  description: The end time of the task
 *              gender:
 *                  type: string
 *                  enum: [Male, Female, Both]
 *                  description: Required gender for the task
 *              location:
 *                  type: string
 *                  description: Location where the task takes place
 *              balancePoints:
 *                  type: integer
 *                  description: Balance points assigned to the task
 *              employeesAmount:
 *                  type: integer
 *                  description: Number of employees required for the task
 *              saveToTasks:
 *                  type: boolean
 *                  description: Whether to save this task as a template
 *              other:
 *                  type: string
 *                  description: Additional information about the task
 *          example:
 *              name: 'Weekly Inventory Check'
 *              description: 'Complete inventory count in the warehouse'
 *              date: '2025-04-20'
 *              startTime: '2025-04-20T10:00:00Z'
 *              endTime: '2025-04-20T12:00:00Z'
 *              gender: 'Both'
 *              location: 'Warehouse A'
 *              balancePoints: 5
 *              employeesAmount: 3
 *              saveToTasks: true
 *              other: 'Bring scanning equipment'
 */

/**
 * @swagger
 * /task:
 *   post:
 *       summary: Create a new task
 *       tags: [Task]
 *       security:
 *           - bearerAuth: []
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Task'
 *       responses:
 *           200:
 *               description: Task created successfully
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Task'
 *           400:
 *              description: Bad request - invalid task data
 *           401:
 *              description: Unauthorized - invalid or missing token
 */
router.post("/", async (req: Request, res: Response) => {
  const task = req.body;

  try {
    const newTask = await createTask(task);
    res.status(200).send(newTask);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

/**
 * @swagger
 * /saved:
 *   get:
 *       summary: Retrieve a list of all saved tasks
 *       tags: [Task]
 *       security:
 *           - bearerAuth: []
 *       responses:
 *           200:
 *               description: A list of tasks
 *               content:
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Task'
 *           400:
 *              description: Bad request
 *           401:
 *              description: Unauthorized - invalid or missing token
 */

router.get("/saved", async (req: Request, res: Response) => {
  try {
    res.status(200).send(await getAllSavedTasks());
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/balancePointsByGroup", async (req: Request, res: Response) => {
  const { groupId } = req.query;
  try {
    const balancePoints = await getBalancePointsByGroupForCurrentMonth(
      Number(groupId)
    );
    res.status(200).send(balancePoints);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

export default router;
