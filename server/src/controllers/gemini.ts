import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const sendPrompt = async () => {
  const background =
    "We are a system that helps organiztions to manage their tasks and missions between their teams." +
    "We will give you the past history of the teams points they earnd so you can give us some conclusions and tips about the next month.";

  // will be removed in the future
  const data = {
    Januarry: [
      { name: "Team A", points: 50 },
      { name: "Team B", points: 30 },
      { name: "Team C", points: 20 },
    ],
    February: [
      { name: "Team A", points: 60 },
      { name: "Team B", points: 40 },
      { name: "Team C", points: 30 },
    ],
    March: [
      { name: "Team A", points: 70 },
      { name: "Team B", points: 50 },
      { name: "Team C", points: 40 },
    ],
    April: [
      { name: "Team A", points: 80 },
      { name: "Team B", points: 60 },
      { name: "Team C", points: 50 },
    ],
  };

  const prompt =
    background +
    " " +
    "Here is the data of the teams points: " +
    JSON.stringify(data) +
    " " +
    "Can you give us some conclusions and tips about the next month? We need it short and clear. 4 points max.";

  const result = await model.generateContent(prompt).catch((err) => {
    console.error(err);
    return err;
  });

  return result.response.text();
};

const analyzeBalnacePoints = async (data) => {
  const prompt = "We are a system that helps organiztions to manage their tasks and missions between their teams." +
  "We will give you now the description of a task and you will rate it from 1 to 7." + 
  "For example, if the task is very easy to do, you will give it a 1. If the task is very hard to do, you will give it a 7." +
  "A hard task is something pysically hard to do, or something that takes a lot of time to do." +
  "A easy task is something that is very easy to do, or something that takes a little time to do." +
  "The task is: " + data.taskName;

  //TODO: add previous data to the prompt
};

export default { sendPrompt, analyzeBalnacePoints };
