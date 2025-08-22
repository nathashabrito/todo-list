import "dotenv/config";
import { z } from "zod";

export const env = z.object({
  PORT: z.coerce.number().default(3333),
  CORS_ORIGIN: z.string().default("*")
}).parse(process.env);
