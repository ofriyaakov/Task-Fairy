import express, { Express } from "express";
import authRoutes from "./src/routes/auth";
import geminiRoues from "./src/routes/gemini";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";
import { errorHandler } from "./src/middleware/errorHandler";
const path = require("path");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web dev 2024 api",
      description: "Blog API Information",
      version: "1.0.0",
      contact: {
        name: "Amazing Developer",
      },
      servers: [{ url: "http://localhost:" + process.env.PORT }],
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/gemini", geminiRoues);

app.use(errorHandler);
app.use(express.static("front"));

// אין תיקיה כזו
// app.get("*", (req, res) => {
//   res.sendFile(path.join("front", "index.html"));
// });

const initApp = () => {
  return new Promise<Express>(async (resolve, reject) => {
    resolve(app);
  });
};

export default initApp;
