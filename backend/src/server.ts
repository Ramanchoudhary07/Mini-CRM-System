import express, { Express } from "express";
import cors from "cors";
import connectDB from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database connection
connectDB();

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`✓ Server started successfully`);
  console.log(`  Port: ${port}`);
  console.log(`  Environment: ${process.env.NODE_ENV}`);
  console.log(`  API Prefix: ${process.env.API_PREFIX}`);
  console.log(`${"=".repeat(50)}\n`);
});
