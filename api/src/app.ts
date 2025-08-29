import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./env";
import { todosRoutes } from "./routes/todo"; // <- caminho correto
import { ZodError } from "zod";
import { UnauthorizedError } from "./errors/unauthorized-error";

export function buildApp() {
  const app = Fastify({ logger: true });

  const origin = env.CORS_ORIGIN === "*" 
    ? true 
    : env.CORS_ORIGIN.split(",").map(s => s.trim());

  app.register(cors, {
    origin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    preflightContinue: true,
  });

  app.get("/", async () => ({ 
    message: "🍰 API do Projeto 7 - Desenvolve Boticário",
    status: "online",
    endpoints: {
      health: "/health",
      todos: "/api/todos"
    }
  }));

  app.get("/health", async () => ({ ok: true }));

  app.register(todosRoutes);

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ message: "Validation error", details: error.issues });
    }

    if (error instanceof UnauthorizedError) {
      return reply.status(401).send({ message: error.message });
    }

    if (env.NODE_ENV !== "production") {
      console.error(error);
    }

    return reply.status(500).send({ message: "Internal server error" });
  });

  return app;
}

