import express, { Request, Response } from "express";

import authenticateToken from "../middleware/jwt";
import {
  getPendingSwapRequests,
  getSwapRequestAmount,
  updateSwapRequestStatus,
} from "../controllers/swap";

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
 * /amount/company/{companyId}:
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

router.get(
  "/amount/company/:companyId",
  async (req: Request, res: Response) => {
    const companyId = req.params.companyId;
    const month = req.params.month;
    try {
      res.status(200).send(await getSwapRequestAmount(+companyId));
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

/**
 * @swagger
 * /swap-request/{swapId}/status:
 *   put:
 *     summary: Update swap request status (generic endpoint)
 *     tags: [swap-requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: swapId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The swap request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - companyId
 *             properties:
 *               status:
 *                 type: integer
 *                 description: Status ID (2=pending, 3=approved, 4=denied)
 *                 example: 3
 *               managerId:
 *                 type: integer
 *                 description: ID of the manager updating the status
 *                 example: 123
 *               companyId:
 *                 type: integer
 *                 description: Company ID to fetch updated pending requests
 *                 example: 456
 *     responses:
 *       200:
 *         description: Swap request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Swap request status updated successfully"
 *                 swapId:
 *                   type: string
 *                   example: "123"
 *                 newStatus:
 *                   type: integer
 *                   example: 3
 *                 updatedRequests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/swap-requests'
 *       400:
 *         description: Bad request - Failed to update swap request status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to update swap request status"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - user is not a manager
 *       404:
 *         description: Swap request not found
 */
router.post("/:swapId/status", async (req: Request, res: Response) => {
  const { swapId } = req.params;
  const { status } = req.body;

  try {
    await updateSwapRequestStatus(swapId, +status);

    res.status(200).json({
      message: "Swap request status updated successfully",
      swapId: swapId,
      newStatus: status,
    });
  } catch (err) {
    console.error("Error updating swap request status:", err);
    res.status(400).json({ error: "Failed to update swap request status" });
  }
});

export default router;