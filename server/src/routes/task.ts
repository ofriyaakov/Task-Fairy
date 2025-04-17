import express, { Request, Response } from "express";

import authenticateToken from "../middleware/jwt";
import { createTask } from "../controllers/task";

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
 *       User:
 *           type: object
 *           required:
 *               - email
 *               - password
 *           properties:
 *               email:
 *                   type: string
 *                   description: The user email
 *               password:
 *                   type: string
 *                   description: The user password
 *           example:
 *               email: 'user@test.com'
 *               password: '1234567'
 *       FullUser:
 *           type: object
 *           required:
 *               - email
 *               - password
 *               - name
 *           properties:
 *               email:
 *                   type: string
 *                   description: The user email
 *               password:
 *                   type: string
 *                   description: The user password
 *               name:
 *                   type: string
 *                   description: The user name
 *           example:
 *               email: 'bob@gmail.com'
 *               password: '123456'
 *               name: 'Bob'
 *       Tokens:
 *          type: object
 *          required:
 *              - accessToken
 *              - refreshToken
 *          properties:
 *              accessToken:
 *                  type: string
 *                  description: The JWT access token
 *              refreshToken:
 *                  type: string
 *                  description: The JWT refresh token
 *          example:
 *              accessToken: '123cd123x1xx1'
 *              refreshToken: '134r2134cr1x3c'
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
 * /user/:
 *   put:
 *       summary: Update a user by id
 *       tags: [Users]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *          - name: user_id
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/User'
 *       responses:
 *           200:
 *               description: Updated user
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *           400:
 *              description: Bad request
 *           404:
 *              description: Not Found
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

export default router;
