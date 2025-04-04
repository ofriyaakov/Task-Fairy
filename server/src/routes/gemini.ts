import express from "express";
import geminiController from "../controllers/gemini";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gemini
 *   description: The Gemini API
 */

router.post("/prompt/", async (req, res) => {
  const question = req.body.prompt;

  try {
    const aiAnswer = await geminiController.sendPrompt(question);

    if (!aiAnswer) res.status(404).json({ message: "Error from Gemini" });
    else res.status(200).send(aiAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /ai/prompt:
 *   post:
 *     summary: Send a prompt to the AI
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The prompt of the request
 *             required:
 *               - prompt
 *     responses:
 *       200:
 *         description: The AI response
 *         content:
 *           application/json
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

export default router;
