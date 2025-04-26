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

router.post("/taskAnalyze/", async (req, res) => {
  try {
    const { task, companyId } = req.body;

    if (!task || !companyId) {
      return res.status(400).json({ message: "Missing task or companyId" });
    }

    const aiAnswer = await geminiController.analyzeBalnacePoints({
      task,
      companyId,
    });

    if (!aiAnswer) res.status(404).json({ message: "Error from Gemini" });
    else res.status(200).send(aiAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
