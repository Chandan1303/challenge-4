import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { api } from "./routes.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"]
      }
    }
  }));

  const allowedOrigins = [
    config.FRONTEND_ORIGIN,
    ...(config.FRONTEND_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? []),
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ];

  const allowedOriginPatterns = [
    /^https:\/\/stadiummind-web-[a-z0-9-]+\.a\.run\.app$/,
    /^https:\/\/stadiummind-web-\d+\.us-central1\.run\.app$/
  ];
  
  app.use(cors({ 
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || allowedOriginPatterns.some((pattern) => pattern.test(origin))) {
        callback(null, true);
      } else {
        callback(Object.assign(new Error("Not allowed by CORS"), { status: 403 }));
      }
    },
    credentials: true 
  }));
  
  app.use(express.json({ limit: "100kb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
  app.use("/api", api);

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    const status = error?.status ?? (error?.name === "ZodError" ? 400 : 500);
    const message = status === 400 ? "Invalid request" : status === 403 ? "Origin not allowed" : "Unexpected server error";
    res.status(status).json({ error: message });
  };
  app.use(errorHandler);
  return app;
}
