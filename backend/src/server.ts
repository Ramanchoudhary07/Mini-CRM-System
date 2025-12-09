import express, { Express } from "express";
import cors from "cors";
import connectDB from "./config/database";
import dotenv from "dotenv";

import leadRoutes from "./routes/leadRoutes";
import agentRoutes from "./routes/agentRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import followUpRoutes from "./routes/followUpRoutes";

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Middleware
app.use(cors(corsOptions));
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

//Routes
const apiPrefix = process.env.API_PREFIX;

app.use(`${apiPrefix}/leads`, leadRoutes);
app.use(`${apiPrefix}/agents`, agentRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/follow-ups`, followUpRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`✓ Server started successfully`);
  console.log(`  Port: ${port}`);
  console.log(`  Environment: ${process.env.NODE_ENV}`);
  console.log(`  API Prefix: ${process.env.API_PREFIX}`);
  console.log(`${"=".repeat(50)}\n`);
});

export default app;
