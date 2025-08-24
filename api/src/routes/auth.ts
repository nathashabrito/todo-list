import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/hash";
import { verifyPassword } from "../lib/hash";

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/register
  app.post("/register", async (request, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6, "password must be at least 6 chars"),
    });
    
    const { email, password } = schema.parse(request.body);

    // e-mail único
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return reply.code(409).send({ message: "Email already registered" });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    });

    return reply.code(201).send(user);
  });

  // POST /auth/login
  app.post("/login", async (request, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const { email, password } = schema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ message: "Invalid credentials" });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ message: "Invalid credentials" });

    const token = app.jwt.sign(
      { sub: user.id, email: user.email },
      { expiresIn: "7d" }
    );

    return reply.send({ token });
  });

  // GET /auth/me (protegido)
  app.get("/me", { preHandler: [app.authenticate] }, async (request) => {
    const userId = (request as any).user.sub as string;
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    });
    return { user: me };
  });
}
