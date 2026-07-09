import { config as loadEnv } from "dotenv";
import { z } from "zod";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (two levels up from backend/src)
loadEnv({ path: resolve(__dirname, "../../.env") });

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  FRONTEND_ORIGINS: z.string().optional(),
  JWT_SECRET: z.string().min(8).default("local-demo-secret"),
  DATABASE_URL: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  AI_TIMEOUT_MS: z.coerce.number().min(1000).max(15000).default(7000)
});

const parsedConfig = schema.parse(process.env);

export const config = {
  ...parsedConfig,
  GROQ_API_KEY: parsedConfig.NODE_ENV === "test" ? undefined : parsedConfig.GROQ_API_KEY
};
