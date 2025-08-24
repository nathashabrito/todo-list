import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";                // ← add
import { env } from "./env";
import { todosRoutes } from "./routes/todo";
import { ZodError } from "zod";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { authRoutes } from "./routes/auth";

export async function buildApp() {
  const app = Fastify({ logger: true });

  const origin = env.CORS_ORIGIN === "*"
    ? true
    : env.CORS_ORIGIN.split(",").map(s => s.trim());

  await app.register(cors, {
    origin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    preflightContinue: true,
  });

  await app.register(jwt, { secret: env.JWT_SECRET });
  
  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch {
      // responde aqui mesmo e encerra o ciclo
      reply.code(401).send({ message: "Not authenticated" });
    }
  });

  app.get("/health", async () => ({ ok: true }));
  await app.register(authRoutes, { prefix: "/auth" });
  app.get("/private/ping", { preHandler: [app.authenticate] }, async (req) => {
    return { ok: true, user: (req as any).user };
  });

  await app.register(todosRoutes);
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ message: "Validation error", details: error.issues });
    }
    if (error instanceof UnauthorizedError) {
      return reply.status(401).send({ message: error.message });
    }
    if (env.NODE_ENV !== "production") console.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  });

  return app;
}

// Tipagem do decorate (para o TS não reclamar em rotas)
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: any, reply: any) => Promise<void>;
  }
}
