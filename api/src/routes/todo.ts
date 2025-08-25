import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export async function todosRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate); // garante que a função authenticate seja executada

  const getUserId = (req: any) => (req as any).user.sub as string;

  // GET /todos - Lista todos com filtros opcionais
  app.get("/todos", async (request, reply) => {
    const querySchema = z.object({
      status: z.enum(["all", "pending", "completed"]).default("all"),
      q: z.string().optional(),
    });

    const { status, q } = querySchema.parse(request.query);
    const userId = getUserId(request); // obtem o userId do token

    const where: any = { userId };

    // Filtro por status
    if (status !== "all") {
      where.completed = status === "completed";
    }

    // Filtro por busca no título
    if (q) {
      where.title = {
        contains: q,
      };
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { todos };
  });

  // POST /todos - Criar novo todo com validação
  app.post("/todos", async (request, reply) => {
    const createTodoSchema = z.object({
      title: z.string().min(1, "Title is required"),
    });

    const { title } = createTodoSchema.parse(request.body);
    const userId = getUserId(request);             // ← pega o userId do token

    const todo = await prisma.todo.create({
      data: { title, userId },                     // ← associa ao dono
    });

    return reply.status(201).send(todo);
  });

  // PATCH /todos/:id
  app.patch("/todos/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string() });
    const bodySchema   = z.object({ title: z.string().min(1).optional(), completed: z.boolean().optional() });

    const { id } = paramsSchema.parse(request.params);
    const data   = bodySchema.parse(request.body);
    const userId = getUserId(request);

    const exists = await prisma.todo.findFirst({ where: { id, userId } });
    if (!exists) return reply.status(404).send({ message: "Todo not found" });

    const updated = await prisma.todo.update({ where: { id }, data });
    return updated;
  });

  // DELETE /todos/:id
  app.delete("/todos/:id", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const userId = getUserId(request);

    const exists = await prisma.todo.findFirst({ where: { id, userId } });
    if (!exists) return reply.status(404).send({ message: "Todo not found" });

    await prisma.todo.delete({ where: { id } });
    return reply.status(204).send();
  });
}


