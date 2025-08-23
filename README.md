# Todo List — API (Fastify)

Documentação curta e fiel ao que já está feito. Termos técnicos em inglês, texto em português.

---

## ✅ O que existe hoje

* Setup do projeto (Node.js + TypeScript + Fastify + CORS)
* `.env` + validação com Zod (`env.ts`)
* Prisma ORM com SQLite (schema + migrate + Prisma Client)
* Rotas implementadas:

  * `GET /health` → teste de saúde da API
  * **Todos CRUD**:

    * `GET /todos` → lista todos os todos, com filtros opcionais (`status=all|pending|completed`, `q=<search>`)
    * `POST /todos` → cria um novo todo (`title`)
    * `PATCH /todos/:id` → atualiza um todo (`title` e/ou `completed`)
    * `DELETE /todos/:id` → deleta um todo

---

## 🗂️ Estrutura do diretório

```
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
```

---

## 🌍 Variáveis de ambiente (`api/.env`)

Copie de `.env.example` e ajuste se preciso:

```
PORT=3333
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="file:./dev.db"
JWT_SECRET=CHANGE_ME_WITH_A_LONG_RANDOM_SECRET
```

* `CORS_ORIGIN` aceita múltiplas origens separadas por vírgula
  (ex.: `http://localhost:5173,http://127.0.0.1:5173`)

---

## ⚡ Como rodar (Windows / PowerShell)

Dentro de `todo-list/api`:

```powershell
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Teste de saúde:

```powershell
curl.exe http://localhost:3333/health
# -> {"ok":true}
```

---

## 🧰 Scripts úteis

```text
npm run dev              # Fastify + tsx
npx prisma generate      # gera Prisma Client
npx prisma migrate dev   # cria/aplica migração
npx prisma studio        # UI do banco (SQLite)
```

---

## 📝 Endpoints — Todos

### 1. Listar todos

**GET /todos**

**Exemplo Request:**

```
GET http://localhost:3333/todos?status=pending&q=estudar
```

**Exemplo Response 200:**

```json
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
```

---

### 2. Criar um todo

**POST /todos**

**Body JSON:**

```json
{
  "title": "Aprender Prisma"
}
```

**Response 201:**

```json
{
  "id": "b123e892-536d-4e57-8901-18a84854ba33",
  "title": "Aprender Prisma",
  "completed": false,
  "createdAt": "2025-08-23T15:10:00.000Z"
}
```

---

### 3. Atualizar um todo

**PATCH /todos/\:id**

**Body JSON (um ou ambos campos):**

```json
{
  "title": "Estudar Fastify e Prisma",
  "completed": true
}
```

**Response 200:**

```json
{
  "id": "e417e892-536d-4e57-8901-18a84854ba32",
  "title": "Estudar Fastify e Prisma",
  "completed": true,
  "createdAt": "2025-08-23T15:00:00.000Z"
}
```

**Response 404 (quando o ID não existe):**

```json
{
  "message": "Todo not found"
}
```

---

### 4. Deletar um todo

**DELETE /todos/\:id**

**Response 204 No Content** (sem body)
**Response 404 (quando o ID não existe):**

```json
{
  "message": "Todo not found"
}
```

---

## 🆘 Troubleshooting (casos reais)

* BOM no package.json (“Unexpected token”): grave sem BOM

```powershell
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText("package.json", (Get-Content package.json -Raw), $Utf8NoBom)
npm i
```

* ERR\_MODULE\_NOT\_FOUND: `src/server.ts`: rode `npm run dev` dentro de `api/` e confirme que `src/server.ts` existe.
* Prisma não encontra schema: execute os comandos na pasta `api/`; confirme `prisma/schema.prisma`.
* Studio não abre: escolha outra porta `npx prisma studio --port 5555`.

---

## 📝 Observação

Este README reflete o estado atual da API. Novas funcionalidades (como autenticação) serão documentadas quando implementadas.
