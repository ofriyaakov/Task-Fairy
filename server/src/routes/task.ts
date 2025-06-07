import express, { Request, Response } from "express";

import authenticateToken from "../middleware/jwt";
import {
  createTask,
  getAllSavedTasks,
  getAllTasksByMonth,
  getBalancePointsByGroupForCurrentMonth,
  getTasksByEmployeeId,
  assignEmployees,
  getSuggestedEmployees,
  getTaskById,
  getUnassignedTasksAmount,
  getAvgTasksPerWeek,
  getAssignedEmployees,
  unassignEmployees,
  getTaskPercentageByGroupForCurrentMonth,
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
  const { taskId, employeeIds, taskDate, taskBalancePoints } = req.body;

  try {
    const newAssiments = await assignEmployees(
      taskId,
      taskDate,
      taskBalancePoints,
      employeeIds
    );
    res.status(200).send(newAssiments);
  } catch (err) {
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
router.post("/unassignEmployees", async (req: Request, res: Response) => {
  const { taskId, employeeIds, taskDate, taskBalancePoints } = req.body;

  try {
    const unassigments = await unassignEmployees(
      taskId,
      taskDate,
      taskBalancePoints,
      employeeIds
    );
    res.status(200).send(unassigments);
  } catch (err) {
    console.error(err);
  }
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve a specific task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Task not found
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const taskId = req.query.taskId as string;
    const task = await getTaskById(taskId);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send(task);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "Failed to retrieve task", error: err });
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

/**
 * @swagger
 * /task/balancePointsByGroup:
 *   get:
 *       summary: Retrieve balance points for a specific company for the current month
 *       tags: [Task]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *           - in: query
 *             name: companyId
 *             required: true
 *             description: ID of the company
 *             schema:
 *                 type: integer
 *       responses:
 *           200:
 *               description: Balance points for the group
 *               content:
 *                   application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              max:
 *                                  type: integer
 *                              min:
 *                                  type: integer
 *                              avg:
 *                                  type: number
 */

router.get("/balancePointsByGroup", async (req: Request, res: Response) => {
  const { companyId } = req.query;
  try {
    const balancePoints = await getBalancePointsByGroupForCurrentMonth(
      Number(companyId)
    );
    res.status(200).send(balancePoints);
  } catch (err) {
    console.error(err);
  }
});

/**
 * @swagger
 * /getTaskPercentageByGroup:
 *   get:
 *     summary: Get the percentage of tasks per group for a given company
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the company to retrieve task percentages for
 *     responses:
 *       200:
 *         description: List of groups and their task percentage
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   group:
 *                     type: string
 *                     example: "managers"
 *                   percentage:
 *                     type: number
 *                     format: float
 *                     example: 34.5
 *       400:
 *         description: Invalid or missing companyId
 *       500:
 *         description: Server error
 */

router.get("/getTaskPercentageByGroup", async (req: Request, res: Response) => {
  const { companyId } = req.query;
  try {
    const PercentageByGroup = await getTaskPercentageByGroupForCurrentMonth(
      Number(companyId)
    );
    res.status(200).send(PercentageByGroup);
  } catch (err) {
    console.error(err);
  }
});

/**
 * @swagger
 * /employee/{employeeId}:
 *   get:
 *     summary: Get all tasks assigned to a specific employee
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the employee
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                   endTime:
 *                     type: string
 *                   balancePoints:
 *                     type: integer
 *                   gender:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/employee/:employeeId", async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;

    res.status(200).send(await getTasksByEmployeeId(employeeId));
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * @swagger
 * /task/month/{month}:
 *   get:
 *       summary: Retrieve a list of all tasks by month with employees number
 *       tags: [Task]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *          - name: month
 *            in: query
 *            required: true
 *            schema:
 *              type: string
 *          - name: companyId
 *            in: query
 *            required: true
 *            schema:
 *              type: string
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

router.get("/month/", async (req: Request, res: Response) => {
  const { userId, companyId, month } = req.query;

  try {
    res.status(200).send(await getAllTasksByMonth(String(userId), Number(month), Number(companyId)));
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * @swagger
 * /task/suggestedEmployees/{taskId}:
 *   get:
 *       summary: Retrieve a list of suggested employees for a specific task
 *       tags: [Task]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *           - in: path
 *             name: taskId
 *             required: true
 *             description: ID of the task
 *             schema:
 *                 type: integer
 *       responses:
 *           200:
 *               description: A list of suggested employees
 *               content:
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                  name:
 *                                      type: string
 */

router.get("/suggestedEmployees", async (req: Request, res: Response) => {
  const taskId = req.query.taskId as string;
  try {
    const suggestedEmployees = await getSuggestedEmployees(taskId);
    res.status(200).send(suggestedEmployees);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * @swagger
 * /task/assignedEmployees/{taskId}:
 *   get:
 *       summary: Retrieve a list of assigned employees for a specific task
 *       tags: [Task]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *           - in: path
 *             name: taskId
 *             required: true
 *             description: ID of the task
 *             schema:
 *                 type: integer
 *       responses:
 *           200:
 *               description: A list of assigned employees
 *               content:
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                  name:
 *                                      type: string
 */

router.get("/assignedEmployees", async (req: Request, res: Response) => {
  const taskId = req.query.taskId as string;
  try {
    const assignedEmployees = await getAssignedEmployees(taskId);
    res.status(200).send(assignedEmployees);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * @swagger
 * /unassignedTasks/company/{companyId}:
 *   get:
 *       summary: Retrieve a number of unassigned tasks
 *       tags: [Task]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *          - name: companyId
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *          - name: month
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *       responses:
 *           200:
 *               description: A number
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Task'
 *           400:
 *              description: Bad request
 *           404:
 *              description: Not Found
 */

router.get(
  "/unassignedTasks/company/:companyId",
  async (req: Request, res: Response) => {
    const companyId = req.params.companyId;
    try {
      const amount = await getUnassignedTasksAmount(+companyId);
      res.status(200).send(amount);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

/**
 * @swagger
 * /task/assingedEmployees/{taskId}:
 *   get:
 *       summary: Retrieve a list of assigned employees for a specific task
 *       tags: [Task]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *           - in: path
 *             name: taskId
 *             required: true
 *             description: ID of the task
 *             schema:
 *                 type: integer
 *       responses:
 *           200:
 *               description: A list of assigned employees
 *               content:
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                  name:
 *                                      type: string
 */

router.get(
  "/avgPerWeek/company/:companyId",
  async (req: Request, res: Response) => {
    const companyId = req.params.companyId;
    try {
      const avg = await getAvgTasksPerWeek(+companyId);
      res.status(200).send(avg);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

export default router;
