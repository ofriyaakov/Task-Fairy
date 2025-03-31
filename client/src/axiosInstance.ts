import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/", // Replace with your Express server's base URL
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

export default axiosInstance;
