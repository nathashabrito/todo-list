import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function todosRoutes(app: FastifyInstance) {
  // GET /todos - Lista todos com filtros opcionais
  app.get('/todos', async (request, reply) => {
    const querySchema = z.object({
      status: z.enum(['all', 'pending', 'completed']).default('all'),
      q: z.string().optional(),
    });

    const { status, q } = querySchema.parse(request.query);

    const where: any = {};

    // Filtro por status
    if (status !== 'all') {
      where.completed = status === 'completed';
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
        createdAt: 'desc',
      },
    });

    return { todos };
  });

  // POST /todos - Criar novo todo com validação
  app.post('/todos', async (request, reply) => {
    const createTodoSchema = z.object({
      title: z.string().min(1, 'Title is required'),
    });

    const { title } = createTodoSchema.parse(request.body);

    const todo = await prisma.todo.create({
      data: {
        title,
      },
    });

    return reply.status(201).send(todo);
  });

  // PATCH /todos/:id - Atualizar todo (title ou completed)
  app.patch("/todos/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const updateTodoSchema = z.object({
      title: z.string().min(1).optional(),
      completed: z.boolean().optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const updateData = updateTodoSchema.parse(request.body);

    // Verificar se o todo existe
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return reply.status(404).send({ message: "Todo not found" });
    }

    // Atualizar campos fornecidos
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return updatedTodo;
  });

  // DELETE /todos/:id - Deletar todo com status 204
  app.delete("/todos/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    // Verificar se o todo existe
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return reply.status(404).send({ message: "Todo not found" });
    }

    await prisma.todo.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}

