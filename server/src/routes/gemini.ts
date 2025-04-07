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
  try {
    const aiAnswer = await geminiController.sendPrompt();

    if (!aiAnswer) res.status(404).json({ message: "Error from Gemini" });
    else res.status(200).send(aiAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /gemini/prompt:
 *   post:
 *     summary: Get a prompt from Gemini
 *     tags: [Gemini]
 *     responses:
 *       200:
 *         description: The prompt from Gemini
 *       400:
 *         description: Error from Gemini
 **/

export default router;
