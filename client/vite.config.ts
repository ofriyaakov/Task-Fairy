import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import fs from 'fs'

dotenv.config();

export default defineConfig({
    plugins: [react()],
    server: {
      https: {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem'),
      },
      host: true,
      port: 443,
    },
  });