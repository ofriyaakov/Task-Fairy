import express, { NextFunction, Request, Response } from "express";
import {
  getAllCompanyEmployeesData,
  getAllUsers,
  getAvgBalancePointsByCompany,
  getUserBalancePointsById,
  getUserById,
  removeUserById,
  updateUserById,
  addNewEmployees,
  updateUserFirstLogin,
  getAssignedEmployeesAmount
} from "../controllers/user";

import authenticateToken from "../middleware/jwt";

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *  name: User
 *  description: The Users API
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
 */

/**
 * @swagger
 * /user:
 *   get:
 *       summary: Retrieve a list of all users
 *       tags: [Users]
 *       security:
 *           - bearerAuth: []
 *       responses:
 *           200:
 *               description: A list of users
 *               content:
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *           400:
 *              description: Bad request
 */

router.get("/", async (req: Request, res: Response) => {
  try {
    res.status(200).send(await getAllUsers());
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * @swagger
 * /user/{user_id}:
 *   get:
 *       summary: Retrieve user by id
 *       tags: [Users]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *          - name: user_id
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *       responses:
 *           200:
 *               description: A specific user
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *           400:
 *              description: Bad request
 *           404:
 *              description: Not Found
 */
router.get(
  "/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.user_id;

    try {
      const user = await getUserById(id);
      if (!user) res.status(404).json({ message: "User not found" });
      else res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /user/points/{user_id}:
 *   get:
 *       summary: Retrieve user's balance_points by id
 *       tags: [Users]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *          - name: user_id
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *       responses:
 *           200:
 *               description: A specific user's balance_points
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *           400:
 *              description: Bad request
 *           404:
 *              description: Not Found
 */
router.get(
  "/points/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.user_id;

    try {
      const balancePoints = await getUserBalancePointsById(id);
      if (!balancePoints) res.status(404).json({ message: "User not found 3" });
      else res.status(200).send(balancePoints);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /user/points/company/{company_id}:
 *   get:
 *       summary: Retrieve company's avg balance_points
 *       tags: [Users]
 *       security:
 *           - bearerAuth: []
 *       parameters:
 *          - name: company_id
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *       responses:
 *           200:
 *               description: A company's avg balance points
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *           400:
 *              description: Bad request
 *           404:
 *              description: Not Found
 */
router.get(
  "/points/company/:company_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.company_id;

    try {
      const avgBalancePoints = await getAvgBalancePointsByCompany(
        Number(companyId)
      );
      if (!avgBalancePoints)
        res.status(404).json({ message: "Couldn't calculate company avg" });
      else res.status(200).send(avgBalancePoints);
    } catch (err) {
      next(err);
    }
  }
);

// /**
//  * @swagger
//  * /user/{user_id}:
//  *   put:
//  *       summary: Update a user by id
//  *       tags: [Users]
//  *       security:
//  *           - bearerAuth: []
//  *       parameters:
//  *          - name: user_id
//  *            in: path
//  *            required: true
//  *            schema:
//  *              type: string
//  *       requestBody:
//  *           required: true
//  *           content:
//  *               application/json:
//  *                   schema:
//  *                       $ref: '#/components/schemas/User'
//  *       responses:
//  *           200:
//  *               description: Updated user
//  *               content:
//  *                   application/json:
//  *                      schema:
//  *                          $ref: '#/components/schemas/User'
//  *           400:
//  *              description: Bad request
//  *           404:
//  *              description: Not Found
//  */

// router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
//   const { id } = req.params;
//   const user = req.body;

//   try {
//     const updatedUser = await updateUserById(id, user);

//     if (!updatedUser) res.status(404).json({ message: "User not found" });
//     else res.status(200).send(updatedUser);
//   } catch (err) {
//     next(err);
//   }
// });

/**
 * @swagger
 * /user/employees/{company_id}:
 *   get:
 *     summary: Retrieve all employees of a company
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: company_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of employees
 * /user/addNewEmployees:
 *   post:
 *     summary: Register multiple new employees to a company
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_id:
 *                 type: number
 *               employees:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NewEmployee'
 *     responses:
 *       200:
 *         description: Employees added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found
 */

router.get(
  "/employees/:company_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.params.company_id;

    try {
      const employeeData = await getAllCompanyEmployeesData(Number(companyId));
      if (!employeeData)
        res.status(404).json({ message: "Couldn't fetch data" });
      else res.status(200).send(employeeData);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /user/{user_id}:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.user_id;

    try {
      await removeUserById(id);
      res.status(200).send({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
);
 *         description: Bad request or insertion failed
 */

router.post("/addNewEmployees", async (req: Request, res: Response) => {
  const { employees, company_id } = req.body;

  try {
    res.status(200).send(await addNewEmployees(employees, company_id));
  } catch (err) {
    console.error("Registration of new employees error:", err);

    res.status(400).json({ message: err.message || "Something went wrong" });
  }
});

/**
 * @swagger
 * /user/{user_id}/first-login:
 *   put:
 *     summary: Complete first login by updating password and city
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing fields or validation error
 *       500:
 *         description: Internal server error
 */

router.put("/:user_id/first-login", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { password, city } = req.body;

    if (!password || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedUser = await updateUserFirstLogin(userId, password, city);

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in first login update", error);
    res.status(500).json({ message: "Failed to update user info" });
  }
});

/**
 * @swagger
 * /assignedAmount/company/:companyId:
 *   get:
 *       summary: Retrieve amount of assigned empployees by company and month
 *       tags: [Users]
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
 *                          $ref: '#/components/schemas/User'
 *           400:
 *              description: Bad request
 *           404:
 *              description: Not Found
 */

router.get("/assignedAmount/company/:companyId", async (req: Request, res: Response) => {
    const companyId = req.params.companyId
      try {
        const assignedAmount = await getAssignedEmployeesAmount(+companyId);
        res.status(200).send(assignedAmount);
      } catch (err) {
        console.error(err);
      }
  }
);

export default router;