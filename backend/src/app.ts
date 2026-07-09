import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { api } from "./routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";

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
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true 
  }));
  
  app.use(express.json({ limit: "100kb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
  app.use(requestLogger);
  app.use("/api", api);
  app.use(notFoundHandler);
  app.use(errorHandler);
  
  return app;
}
