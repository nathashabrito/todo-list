import 'dotenv/config';           // (carrega .env no bootstrap)
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  CORS_ORIGIN: z.string().default('*'),            // 1 ou N origens (vírgula)
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
});

export const env = schema.parse(process.env);

// helper: transforma "a,b,c" em array para o CORS
export const corsOrigin =
  env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map(s => s.trim());

