# Todo List — API (Fastify) — README (estado atual)

Documentação curta e fiel ao que **já está feito**. Termos técnicos em inglês, texto em português.

## ✅ O que existe hoje
- Setup do projeto (Node.js + TypeScript + Fastify + CORS)
- `.env` + validação com **Zod** (`env.ts`)
- **Prisma ORM** com **SQLite** (schema + migrate + Prisma Client)
- Rota **GET `/health`** funcionando

## 🗂️ Estrutura do diretório
```
api/
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/…
├─ src/
│  ├─ env.ts          # carrega .env e valida com Zod
│  ├─ lib/
│  │  └─ prisma.ts    # PrismaClient (singleton)
│  ├─ app.ts          # instancia Fastify, registra CORS, /health
│  └─ server.ts       # inicia o servidor
├─ .env               # variáveis locais (não comitar)
├─ .env.example
├─ package.json
└─ tsconfig.json
```

## 🌍 Variáveis de ambiente (api/.env)
Copie de `.env.example` e ajuste se preciso:
```env
PORT=3333
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="file:./dev.db"
JWT_SECRET=CHANGE_ME_WITH_A_LONG_RANDOM_SECRET
```
- `CORS_ORIGIN` aceita **múltiplas** origens separadas por vírgula (ex.: `http://localhost:5173,http://127.0.0.1:5173`).

## ⚡ Como rodar (Windows / PowerShell)
Execute dentro de `todo-list/api`:

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

## 🧰 Scripts úteis
```powershell
npm run dev              # Fastify + tsx
npx prisma generate      # gera Prisma Client
npx prisma migrate dev   # cria/aplica migração
npx prisma studio        # UI do banco (SQLite)
```

## 🆘 Troubleshooting (casos reais)
- **BOM no package.json** (“Unexpected token”): grave sem BOM
  ```powershell
  $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [IO.File]::WriteAllText("package.json", (Get-Content package.json -Raw), $Utf8NoBom)
  npm i
  ```
- **ERR_MODULE_NOT_FOUND: src/server.ts**: rode `npm run dev` **dentro de `api/`** e confirme que `src/server.ts` existe.
- **Prisma não encontra schema**: execute os comandos na pasta `api/`; confirme `prisma/schema.prisma`.
- **Studio não abre**: escolha outra porta `npx prisma studio --port 5555`.

## 📝 Observação
Este README reflete **apenas** o que está implementado até agora. Novas rotas (todos/auth) serão documentadas quando forem criadas.
