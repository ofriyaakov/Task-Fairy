import express, { Request, Response } from "express";

import authenticateToken from "../middleware/jwt";
import { addSwapRequest, getPendingSwapRequests } from "../controllers/swap";

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *  name: swap-requests
 *  description: The Swap requests API
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
 * /pending:
 *   get:
 *       summary: Retrieve a list of all pending swap requests by company id
 *       tags: [swap-requests]
 *       security:
 *           - bearerAuth: []
 *       responses:
 *           200:
 *               description: A list of swap requests
 *               content:
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/swap-requests'
 *           400:
 *              description: Bad request
 *           401:
 *              description: Unauthorized - invalid or missing token
 */

router.get("/pending", async (req: Request, res: Response) => {
    const { companyId } = req.query;
    try {
        res.status(200).send(await getPendingSwapRequests(+companyId));
    } catch (err) {
        res.status(400).send(err);
    }
});


/**
 * @swagger
 * /:
 *   post:
 *       summary: Create a new swap request
 *       tags: [swap-requests]
 *       security:
 *           - bearerAuth: []
 *       responses:
 *           201:
 *               description: An object of swap request
 *               content:
 *                   application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/swap-requests'
 *           400:
 *              description: Bad request
 *           401:
 *              description: Unauthorized - invalid or missing token
 */

router.post("/", async (req: Request, res: Response) => {
    const { swapRequest } = req.body;
    try {
        res.status(201).send(await addSwapRequest(swapRequest));
    } catch (err) {
        res.status(400).send(err);
    }
});

export default router;