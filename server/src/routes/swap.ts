import express, { Request, Response } from "express";

import authenticateToken from "../middleware/jwt";
import { getPendingSwapRequests, getSwapRequestAmount } from "../controllers/swap";

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
 * //amount/company/:companyId/month/:month:
 *   get:
 *       summary: Retrieve a number of swap request amount by company id and month
 *       tags: [swap-requests]
 *       security:
 *           - bearerAuth: []
 *       responses:
 *           200:
 *               description: A number
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

router.get("/amount/company/:companyId/month/:month", async (req: Request, res: Response) => {
    const companyId = req.params.companyId
    const month = req.params.month
    try {
        res.status(200).send(await getSwapRequestAmount(+companyId, +month));
    } catch (err) {
        res.status(400).send(err);
    }
});

export default router;