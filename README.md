# Desenvolvimento

Iniciei pela criação do setup do projeto, e toda estrutura do repo na branch ´back´

## Criar pastas e arquivos Back-end (PowerShell):

1. Init npm + tsconfig

``` powershell
Set-Location "C:\Users\...\todo-list"
New-Item -ItemType Directory -Force -Path api | Out-Null
Set-Location api

npm init -y
npm pkg set type="module"
npm pkg set scripts.dev="tsx watch src/server.ts"


@'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
'@ | Set-Content -Encoding utf8 tsconfig.json

```

2. Install deps (fastify, @fastify/cors, zod, dotenv)

``` powershell
npm i fastify @fastify/cors zod dotenv
```

3. Install devDeps (typescript, tsx, @types/node)
``` powershell
npm i -D typescript tsx @types/node
```
4. Criar src structure (app.ts, server.ts, etc.)

``` powershell
New-Item -ItemType Directory -Force -Path src | Out-Null

# src/env.ts
@'
import "dotenv/config";
import { z } from "zod";

export const env = z.object({
  PORT: z.coerce.number().default(3333),
  CORS_ORIGIN: z.string().default("*")
}).parse(process.env);
'@ | Set-Content -Encoding utf8 src\env.ts

# src/app.ts (Fastify básico + CORS + /health)
@'
import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./env";

export function buildApp() {
  const app = Fastify({ logger: true });
  const origin = env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map(s => s.trim());
  app.register(cors, { origin });
  app.get("/health", async () => ({ ok: true }));
  return app;
}
'@ | Set-Content -Encoding utf8 src\app.ts

# src/server.ts (start)
@'
import { buildApp } from "./app";
import { env } from "./env";

const app = buildApp();
app.listen({ host: "0.0.0.0", port: env.PORT })
  .then(() => console.log(`API on http://localhost:${env.PORT}`))
  .catch((err) => { console.error(err); process.exit(1); });
'@ | Set-Content -Encoding utf8 src\server.ts
```
5. Rodar servidor 

``` powershell
npm run dev
```
O terminal deve apresentar algo como:
``` powershell
$ npm run dev
> api@1.0.0 dev
> tsx watch src/server.ts

{"level":30,"time":1234567890,"msg":"Server listening at http://0.0.0.0:3333"}
API on http://localhost:3333
```
5. Em outro terminal, teste:

``` powershell
curl.exe http://localhost:3333/health
```
Resposta esperada:
``` powershell
{"ok":true}
```

## Banco de dados (SQLite + Prisma):

6. Install Prisma

``` powershell
npm i prisma @prisma/client
npm pkg set scripts.prisma:generate="prisma generate"
npm pkg set scripts.prisma:migrate="prisma migrate dev"
npm pkg set scripts.prisma:studio="prisma studio"
```

7. Setup Prisma

``` powershell
# Criar pasta prisma e schema
npx prisma init --datasource-provider sqlite

# Editar prisma/schema.prisma
@'
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Todo {
  id        String   @id @default(uuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
'@ | Set-Content -Encoding utf8 prisma\schema.prisma
```

8. Gerar cliente e migração

``` powershell
npm run prisma:generate
npm run prisma:migrate
```

O terminal deve apresentar algo como:
``` console
✔ Enter a name for the new migration: … init
Prisma schema loaded from prisma\schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

✔ Generated Prisma Client (v6.14.0) to .\src\generated\prisma in 234ms
```

9. Verificar banco (opcional)

``` powershell
npm run prisma:studio
```