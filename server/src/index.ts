import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import { globalLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth";
import issueRoutes from "./routes/issues";
import userRoutes from "./routes/users";
import projectRoutes from "./routes/projects";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use((req, res, next) => globalLimiter(req, res, next));

const allowedOrigins = process.env.CLIENT_URL?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Issue Tracker API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
    });
  },
);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();
