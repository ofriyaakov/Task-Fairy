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
    const { companyId } = req.body;
    const aiAnswer = await geminiController.sendPrompt(companyId);

    if (!aiAnswer) res.status(404).json({ message: "Error from Gemini" });
    else res.status(200).send(aiAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/taskAnalyze/", async (req, res) => {
  try {
    const { name, description, companyId } = req.body;

    if (!name || !description || !companyId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const aiAnswer = await geminiController.analyzeBalnacePoints({
      name,
      description,
      companyId,
    });

    if (!aiAnswer) res.status(404).json({ message: "Error from Gemini" });
    else res.status(200).send(aiAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
