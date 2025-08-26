import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8080),
  CORS_ORIGIN: z.string().default("*"),
  DATABASE_URL: z.string().default("postgresql://usuario:senha@localhost:5432/seubanco"),
  JWT_SECRET: z.string().default("umsegredoforte123"),
});

export const env = envSchema.parse(process.env);