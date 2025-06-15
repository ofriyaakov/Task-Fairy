import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getAllTasksBalancePoints,
  getBalancePointsByGroupForEachMonth,
} from "./task";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const sendPrompt = async (companyId: number) => {
  const background =
    "We are a system that helps organiztions to manage their tasks and missions between their teams." +
    "We will give you the past history of the teams points they earnd so you can give us some conclusions and tips about the next month.";

  const data = await getBalancePointsByGroupForEachMonth(companyId).catch(
    (err) => {
      console.error(err);
      return err;
    }
  );

  const seed = Date.now();

  const prompt =
    background +
    " " +
    "Here’s the teams' balance-points data: " +
    JSON.stringify(data) +
    " " +
    "Write exactly 3 short, practical tips based on this data." +
    " Each tip must be under 30 words." +
    " Focus on team imbalance, rising workloads, new team activity, overload, or underuse." +
    " Avoid repeating phrasing from earlier tips. Avoid vague praise." +
    " Sound like a team manager giving clear advice." +
    " " +
    "⚠️ Strict output format: one line only, with the 3 tips separated by slashes." +
    " No bullets. No numbers. No newlines. No explanation." +
    " " +
    "Example format: 'Managers took on too much in June — lighten their load. / Team X was underused — assign more tasks. / Workload was uneven — rebalance across teams.'" +
    " " +
    "Seed: " +
    seed;

  const res = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      topP: 1,
      topK: 40,
      candidateCount: 1,
      maxOutputTokens: 120,
    },
  });

  const text = res.response.text().trim();

  return text
    .split("/")
    .map((t) => t.trim().replace(/^[-–•\d.]+\s*/, ""))
    .filter((t) => t.length);
};

const analyzeBalnacePoints = async (data) => {
  const previousTasks = await getAllTasksBalancePoints(data.companyId);

  const background =
    "We are a system that helps organiztions to manage their tasks and missions between their teams." +
    "We will give you now the description of a task and you will rate it from 1 to 7.";

  const scalingDescription =
    "For example, if the task is very easy to do, you will give it a 1. If the task is very hard to do, you will give it a 7." +
    "A hard task is something pysically hard to do, or something that takes a lot of time to do." +
    "A easy task is something that is very easy to do, or something that takes a little time to do.";

  let prompt = background + " " + scalingDescription + " ";

  if (previousTasks.length > 0) {
    prompt +=
      "This is the data of the previous tasks. Please rate the new task based on the previous ratings. " +
      JSON.stringify(previousTasks) +
      " ";
  }

  prompt +=
    " " +
    "Here is the data of the task: " +
    JSON.stringify(data) +
    " " +
    "The task is: " +
    data.taskName +
    " " +
    "Can you rate it from 1 to 7? Give us just the number.";

  const result = await model.generateContent(prompt).catch((err) => {
    console.error(err);
    return err;
  });

  return result.response.text();
};

export default { sendPrompt, analyzeBalnacePoints };
