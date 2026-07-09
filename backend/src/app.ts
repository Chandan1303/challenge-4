import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { api } from "./routes.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  
  // Allow multiple frontend origins for development
  const allowedOrigins = [
    config.FRONTEND_ORIGIN,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ];
  
  app.use(cors({ 
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true 
  }));
  
  app.use(express.json({ limit: "100kb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
  app.use("/api", api);

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    const status = error?.name === "ZodError" ? 400 : 500;
    res.status(status).json({ error: status === 400 ? "Invalid request" : "Unexpected server error" });
  };
  app.use(errorHandler);
  return app;
}
