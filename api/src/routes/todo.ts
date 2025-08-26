import { FastifyInstance } from "fastify";

let todos: any[] = [];
let nextId = 1;

export async function todosRoutes(app: FastifyInstance) {
  app.get("/api/todos", async () => {
    return { todos };
  });

  app.post("/api/todos", async (request) => {
    const { title } = request.body as { title: string };
    const todo = {
      id: nextId++,
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    todos.push(todo);
    return todo;
  });

  app.patch("/api/todos/:id", async (request) => {
    const { id } = request.params as { id: string };
    const updates = request.body as any;
    const todoIndex = todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }
    
    todos[todoIndex] = { ...todos[todoIndex], ...updates };
    return todos[todoIndex];
  });

  app.delete("/api/todos/:id", async (request) => {
    const { id } = request.params as { id: string };
    const todoIndex = todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }
    
    todos.splice(todoIndex, 1);
    return { success: true };
  });
}