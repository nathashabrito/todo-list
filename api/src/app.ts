import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./env";
import { todosRoutes } from "./routes/todo"; // <-- importa suas rotas

export function buildApp() {
  const app = Fastify({ logger: true });

  const origin = env.CORS_ORIGIN === "*" 
    ? true 
    : env.CORS_ORIGIN.split(",").map(s => s.trim());

  app.register(cors, { origin });

  app.get("/health", async () => ({ ok: true }));

  //módulo de rotas
  app.register(todosRoutes);

  return app;
}

