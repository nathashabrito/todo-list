import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8080),
  CORS_ORIGIN: z.string().default("*"),
  DATABASE_URL: z.string().default("postgresql://neondb_owner:npg_PFLKt78ywuHb@ep-snowy-bonus-adurjx3g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"),
  JWT_SECRET: z.string().default("477cffd1c35340ffb87771f7ddb9a5923832fb5ad8a74668ad2e47b6e57204f3"),
});

export const env = envSchema.parse(process.env);