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
  JWT_SECRET: z.string().min(8).default("local-demo-secret"),
  DATABASE_URL: z.string().optional(),
  GROQ_API_KEY: z.string().optional()
});

export const config = schema.parse(process.env);
