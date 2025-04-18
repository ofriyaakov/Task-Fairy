import express, { Request, Response } from "express";

import authenticateToken from "../middleware/jwt";
import { createTask, assignEmployees } from "../controllers/task";

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
 * /task/assignEmployees:
 *   post:
 *       summary: Assign employees to a task
 *       tags: [Task, Users]
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/r_tasks_users'
 *       responses:
 *           200:
 *               description: Assigned employees successfully
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/r_tasks_users'
 *           400:
 *              description: Bad request - invalid data
 *           401:
 *              description: Unauthorized - invalid or missing token
 */
router.post("/assignEmployees", async (req: Request, res: Response) => {
  const { taskId, employeeIds } = req.body;

  try {
    const newAssiments = await assignEmployees(taskId, employeeIds);
    res.status(200).send(newAssiments)
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

export default router;
