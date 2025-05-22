import express, { NextFunction, Request, Response } from "express";
import { getAllUsers, getAvgBalancePointsByCompany, getUserBalancePointsById,
   getUserById, updateUserById, addNewEmployees, getAssignedEmployeesAmount } from "../controllers/user";

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
router.get("/points/:user_id", async (req: Request, res: Response, next: NextFunction) => {
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
router.get("/points/company/:company_id", async (req: Request, res: Response, next: NextFunction) => {
  const companyId = req.params.company_id;

  try {
    const avgBalancePoints = await getAvgBalancePointsByCompany(Number(companyId));
    if (!avgBalancePoints) res.status(404).json({ message: "Couldn't calculate company avg" });
    else res.status(200).send(avgBalancePoints);
  } catch (err) {
    next(err);
  }
}
);

/**
 * @swagger
 * /user/{user_id}:
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
 * /assignedAmount:
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

router.get("/assignedAmount/company/:companyId/month/:month", async (req: Request, res: Response) => {
    const companyId = req.params.companyId
    const month = req.params.month
      try {
        const assignedAmount = await getAssignedEmployeesAmount(+companyId, +month);
        res.status(200).send(assignedAmount);
      } catch (err) {
        console.error(err);
      }
  }
);

export default router;
