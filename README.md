Todo List — API (Fastify)

Documentação curta e fiel ao que já está feito. Termos técnicos em inglês, texto em português.




✅ O que existe hoje

•
Setup do projeto (Node.js + TypeScript + Fastify + CORS)

•
.env + validação com Zod (env.ts)

•
Prisma ORM com SQLite (schema + migrate + Prisma Client)

•
Rotas implementadas:

•
GET /health → teste de saúde da API

•
Todos CRUD:

•
GET /todos → lista todos os todos, com filtros opcionais (status=all|pending|completed, q=<search>)

•
POST /todos → cria um novo todo (title)

•
PATCH /todos/:id → atualiza um todo (title e/ou completed)

•
DELETE /todos/:id → deleta um todo








✨ Novas Funcionalidades e Melhorias

•
Configuração de CORS Aprimorada: Utiliza @fastify/cors para gerenciar o acesso de diferentes origens, permitindo a configuração de origin dinamicamente e o cabeçalho Authorization. Inclui validação de preflight OPTIONS.

•
Endpoint de Saúde (/health): Um endpoint simples GET /health que retorna { ok: true } para verificar a disponibilidade da aplicação.

•
Logger Integrado: O Fastify logger está habilitado para facilitar o monitoramento e depuração da aplicação.

•
Validação com Zod: Utiliza a biblioteca Zod para validação robusta de schemas de entrada (corpo da requisição, parâmetros e queries), garantindo a integridade dos dados.

•
Formato Unificado de Erros: Respostas de erro padronizadas com o formato { message, details? } para facilitar o tratamento de erros no frontend.

•
Códigos de Status HTTP Detalhados: Utilização apropriada de códigos de status HTTP:

•
400 Bad Request: Para erros de validação (ZodError).

•
401 Unauthorized: Para erros de autenticação (UnauthorizedError).

•
404 Not Found: Quando um recurso não é encontrado (ex: Todo não encontrado).

•
422 Unprocessable Entity: (Implícito via Zod para validação semântica, embora retorne 400 explicitamente para ZodError).

•
500 Internal Server Error: Para erros inesperados no servidor.



•
Ocultar Stacktrace em Produção: Em ambiente de produção, o stacktrace de erros é ocultado para segurança, enquanto em desenvolvimento é exibido para depuração.

•
Testes Negativos Facilitados: A estrutura da API permite a fácil implementação de testes negativos para cenários de IDs inválidos e payloads incorretos.




🗂️ Estrutura do diretório

Plain Text


api/
├─ prisma/
│ ├─ schema.prisma
│ └─ migrations/…
├─ src/
│ ├─ env.ts # carrega .env e valida com Zod
│ ├─ lib/
│ │ └─ prisma.ts # PrismaClient (singleton)
│ ├─ routes/
│ │ └─ todo.ts # todas as rotas do recurso todo
│ ├─ app.ts # instancia Fastify, registra CORS, /health, /todos
│ └─ server.ts # inicia o servidor
├─ .env # variáveis locais (não comitar)
├─ .env.example
├─ package.json
└─ tsconfig.json





🌍 Variáveis de ambiente (api/.env)

Copie de .env.example e ajuste se preciso:

Plain Text


PORT=3333
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="file:./dev.db"
JWT_SECRET=CHANGE_ME_WITH_A_LONG_RANDOM_SECRET


•
CORS_ORIGIN aceita múltiplas origens separadas por vírgula
(ex.: http://localhost:5173,http://127.0.0.1:5173)




⚡ Como rodar (Windows / PowerShell)

Dentro de todo-list/api:

Plain Text


npm i
npx prisma generate
npx prisma migrate dev --name init
npm run dev


Teste de saúde:

Plain Text


curl.exe http://localhost:3333/health
# -> {"ok":true}





🧰 Scripts úteis

Plain Text


npm run dev              # Fastify + tsx
npx prisma generate      # gera Prisma Client
npx prisma migrate dev   # cria/aplica migração
npx prisma studio        # UI do banco (SQLite)





📝 Endpoints — Todos

1. Listar todos

GET /todos

Exemplo Request:

Plain Text


GET http://localhost:3333/todos?status=pending&q=estudar


Exemplo Response 200:

JSON


{
  "todos": [
    {
      "id": "e417e892-536d-4e57-8901-18a84854ba32",
      "title": "Estudar Fastify",
      "completed": false,
      "createdAt": "2025-08-23T15:00:00.000Z"
    }
  ]
}


Exemplos cURL para GET /todos

Bash


# Listar todos os todos
curl -X GET http://localhost:3333/todos

# Listar todos pendentes
curl -X GET "http://localhost:3333/todos?status=pending"

# Buscar todos com 'comprar' no título
curl -X GET "http://localhost:3333/todos?q=comprar"

# Combinar filtros
curl -X GET "http://localhost:3333/todos?status=completed&q=trabalho"





2. Criar um todo

POST /todos

Body JSON:

JSON


{
  "title": "Aprender Prisma"
}


Response 201:

JSON


{
  "id": "b123e892-536d-4e57-8901-18a84854ba33",
  "title": "Aprender Prisma",
  "completed": false,
  "createdAt": "2025-08-23T15:10:00.000Z"
}


Exemplo cURL para POST /todos

Bash


curl -X POST -H "Content-Type: application/json" -d '{"title": "Comprar leite"}' http://localhost:3333/todos





3. Atualizar um todo

PATCH /todos/:id

Body JSON (um ou ambos campos):

JSON


{
  "title": "Estudar Fastify e Prisma",
  "completed": true
}


Response 200:

JSON


{
  "id": "e417e892-536d-4e57-8901-18a84854ba32",
  "title": "Estudar Fastify e Prisma",
  "completed": true,
  "createdAt": "2025-08-23T15:00:00.000Z"
}


Response 404 (quando o ID não existe):

JSON


{
  "message": "Todo not found"
}


Exemplos cURL para PATCH /todos/:id

Bash


# Substitua <TODO_ID> pelo ID real do todo
curl -X PATCH -H "Content-Type: application/json" -d '{"completed": true}' http://localhost:3333/todos/<TODO_ID>

curl -X PATCH -H "Content-Type: application/json" -d '{"title": "Comprar pão e leite"}' http://localhost:3333/todos/<TODO_ID>





4. Deletar um todo

DELETE /todos/:id

Response 204 No Content (sem body)
Response 404 (quando o ID não existe):

JSON


{
  "message": "Todo not found"
}


Exemplo cURL para DELETE /todos/:id

Bash


# Substitua <TODO_ID> pelo ID real do todo
curl -X DELETE http://localhost:3333/todos/<TODO_ID>





🆘 Troubleshooting (casos reais)

•
BOM no package.json (“Unexpected token”): grave sem BOM

Plain Text


$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText("package.json", (Get-Content package.json -Raw), $Utf8NoBom)
npm i


•
ERR_MODULE_NOT_FOUND: src/server.ts: rode npm run dev dentro de api/ e confirme que src/server.ts existe.

•
Prisma não encontra schema: execute os comandos na pasta api/; confirme prisma/schema.prisma.

•
Studio não abre: escolha outra porta npx prisma studio --port 5555.




📝 Observação

Este README reflete o estado atual da API. Novas funcionalidades (como autenticação) serão documentadas quando implementadas.


