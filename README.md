# Todo List — API (Fastify) + Web (Vite/React)

Documentação **completa** do projeto, pronta para uso pela equipe. Texto em **português**, termos técnicos em **inglês**.

> **Stack**: Node.js + TypeScript • Fastify • Prisma ORM + SQLite (dev) • Zod • JWT (auth) • Vite + React + Tailwind (web)

---

## 🚀 Sumário
- [Visão geral](#visão-geral)
- [Arquitetura do repositório](#arquitetura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Configuração de ambiente](#configuração-de-ambiente)
- [Como rodar (dev)](#como-rodar-dev)
- [API Reference](#api-reference)
  - [Auth](#auth)
  - [Todos](#todos)
- [Padrões de código](#padrões-de-código)
- [Scripts úteis](#scripts-úteis)
- [Troubleshooting](#troubleshooting)
- [Roadmap curto](#roadmap-curto)
- [Licença](#licença)

---

## Visão geral
Aplicação de **lista de tarefas** com autenticação **JWT**. O **back-end** expõe uma **API REST** protegida e o **front-end** (Vite/React) consome essa API, oferecendo tela de **login** e CRUD de **todos** (com filtro por status e busca).

- **Fail-fast** com `Zod` validando variáveis do `.env` via `env.ts` (não sobe sem `JWT_SECRET`, etc.).
- **Schema-first** com `Prisma` e **migrations**.
- **CORS** configurável para permitir o front em `localhost` (ou outras origens).

---

## Arquitetura do repositório
```
todo-list/
├─ api/                      # Back-end (Fastify + Prisma + SQLite)
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ migrations/…
│  ├─ src/
│  │  ├─ routes/
│  │  │  ├─ auth.ts         # /auth (register, login, me)
│  │  │  └─ todo.ts         # /todos (CRUD, por usuário)
│  │  ├─ lib/
│  │  │  ├─ prisma.ts       # PrismaClient (singleton)
│  │  │  └─ hash.ts         # bcrypt helpers
│  │  ├─ errors/
│  │  │  └─ unauthorized-error.ts
│  │  ├─ env.ts             # validação de variáveis ambiente
│  │  ├─ app.ts             # plugins, CORS, JWT, errorHandler
│  │  └─ server.ts          # bootstrap
│  ├─ .env                  # NÃO commitar
│  ├─ .env.example
│  ├─ package.json
│  └─ tsconfig.json
└─ web/                      # Front-end (Vite + React + Tailwind)
   ├─ .env
   ├─ src/
   ├─ index.html
   ├─ package.json
   └─ vite.config.ts
```

> **ESM note (API)**: imports locais usam sufixo **`.js`** nas rotas/libs (`../lib/prisma.js`).

---

## Pré-requisitos
- **Node.js 20+** (ou 22+), **npm**.
- **Git**.
- (Dev) **SQLite** já embutido via Prisma; nenhum serviço extra.

---

## Configuração de ambiente

### API (`api/.env`)
Copie de `.env.example` e ajuste se necessário:
```env
PORT=3333
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="file:./dev.db"
JWT_SECRET=CHANGE_ME_WITH_A_LONG_RANDOM_SECRET
```
- `CORS_ORIGIN` aceita múltiplas origens separadas por vírgula (ex.: `http://localhost:5173,http://127.0.0.1:5173`).

### Web (`web/.env`)
```env
VITE_API_URL=http://localhost:3333
```

---

## Como rodar (dev)

### 1) API
```bash
# dentro de ./api
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run dev
# API em http://localhost:3333
```

**Opcional (visualizar DB):**
```bash
npx prisma studio
```

### 2) Web
```bash
# dentro de ./web
npm i
npm run dev
# Web em http://localhost:5173
```

> Garanta que o `VITE_API_URL` (web) aponta para a porta da API.

---

## API Reference

### Autenticação
Base URL: `http://localhost:3333`

#### POST `/auth/register`
Cria usuário.
```jsonc
// body
{ "email": "user@example.com", "password": "123456" }

// 201
{ "id": "uuid", "email": "user@example.com", "createdAt": "2025-01-01T..." }
```

#### POST `/auth/login`
Retorna token JWT (expira em 7 dias).
```jsonc
// body
{ "email": "user@example.com", "password": "123456" }

// 200
{ "token": "eyJhbGciOi..." }
```

#### GET `/auth/me`  (Bearer token)
```http
Authorization: Bearer <token>
```
```jsonc
// 200
{ "user": { "id": "uuid", "email": "user@example.com", "createdAt": "..." } }
```

> **Erros padronizados**: `401 { "message": "Not authenticated" }`, `409 { "message": "Email already registered" }`, `400/422` para validação.

---

### Todos (autenticados)
Todas as rotas exigem `Authorization: Bearer <token>`.

#### GET `/todos?status=all|pending|completed&q=texto`
Lista os todos **do usuário autenticado**, com filtros.
```jsonc
// 200
{
  "todos": [
    {
      "id": "uuid",
      "title": "Minha tarefa",
      "completed": false,
      "userId": "uuid",
      "createdAt": "2025-01-01T...",
      "updatedAt": "2025-01-01T..."
    }
  ]
}
```

#### POST `/todos`
Cria um todo para o usuário autenticado.
```jsonc
// body
{ "title": "Comprar café" }

// 201
{
  "id": "uuid",
  "title": "Comprar café",
  "completed": false,
  "userId": "uuid",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### PATCH `/todos/:id`
Atualiza campos permitidos **do usuário autenticado**.
```jsonc
// body (qualquer combinação)
{ "title": "Novo título", "completed": true }

// 200
{ "id": "uuid", "title": "Novo título", "completed": true, "userId": "uuid", ... }
```

#### DELETE `/todos/:id`
Remove um todo **do usuário autenticado**.
```http
// 204 No Content
```

> **Nota de segurança**: todas as operações de todos checam posse do usuário (`where: { id, userId }` ou `userId` no filtro).

---

## Padrões de código
- **TypeScript strict**, **ES Modules**.
- **Uma instância** de `PrismaClient` em `src/lib/prisma.ts`.
- **Plugins de rotas** registrados em `app.ts` com `prefix` (ex.: `/auth`).
- **Zod** para validar `env` e entradas (body/query/params).
- **HTTP status** apropriados: 201 (create), 204 (delete), 400/422 (validation), 401 (auth), 404 (not found).

---

## Scripts úteis
```bash
# API
npm run dev              # Fastify + tsx (dev server)
npx prisma generate      # gera Prisma Client
npx prisma migrate dev   # cria/aplica migração do schema
npx prisma studio        # UI do banco SQLite

# Web
npm run dev              # Vite dev server
npm run build            # build de produção
npm run preview          # preview local do build
```

---

## Troubleshooting
- **PowerShell vs CMD**: em PowerShell use **crase ( ` )** para quebrar linha; `^` é do CMD.
- **BOM em package.json** (“Unexpected token …”): salve sem BOM.
  ```powershell
  $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [IO.File]::WriteAllText("package.json", (Get-Content package.json -Raw), $Utf8NoBom)
  npm i
  ```
- **ERR_MODULE_NOT_FOUND ao importar libs locais**: use sufixo **`.js`** em imports ESM locais (`../lib/prisma.js`).
- **401 em rotas protegidas**: verifique header `Authorization: Bearer <token>` e `JWT_SECRET` no `.env`.

---

## Roadmap curto
- Testes de rota (Vitest/Supertest).
- Seed de dados de desenvolvimento.
- Deploy (API e Web).

---

