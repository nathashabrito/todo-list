import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./env";

export function buildApp() {
  const app = Fastify({ logger: true });
  const origin = env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map(s => s.trim());
  app.register(cors, { origin });
  app.get("/health", async () => ({ ok: true }));
  return app;
}
