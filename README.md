# To Do List — React + TailwindCSS

Este projeto é uma aplicação web de **To Do List**, criada para praticar conceitos fundamentais do **React**.  
Conta com **front-end em React**, estilizado com **TailwindCSS**, e **back-end API REST**.

---

## Objetivos Gerais

- Criar um To Do List clássico com funcionalidades essenciais.
- Aprender os conceitos fundamentais do React de forma prática.
- Gerenciar estado de tarefas, carregamento e erros.
- Construir interface responsiva para todos os dispositivos.
- Integrar front-end com uma API REST.

---

## Estrutura do Projeto

```
projeto-todo-list/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── env.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   ├── components/
│   │   └── App.jsx
│   ├── .env
│   └── package.json
└── README.md
```

---

## Funcionalidades Implementadas

### ✨ Interface Moderna
- Estilização com **TailwindCSS** e design **mobile-first**.
- Feedback visual para status da tarefa (texto riscado ou cor diferente).
- **Contador de tarefas**: total, pendentes e concluídas.

### 💬 Gerenciamento de Tarefas
- **Adicionar tarefas**: input validado para não permitir entradas vazias.
- **Listar tarefas**: exibe todas, mostrando mensagem amigável quando a lista está vazia.
- **Marcar como concluída**: alterna status com checkbox ou botão.
- **Remover tarefas**: botão de delete para remover tarefas.
- **Filtrar tarefas**: todas, pendentes ou concluídas.

---

## Configuração e Uso

### Pré-requisitos
- Node.js e npm
- Editor de código (VS Code recomendado)

### Instalação

Clone o repositório:

```bash
git clone https://www.dio.me/articles/enviando-seu-projeto-para-o-github
cd [pasta do projeto]
```

#### Back-end (API)

```bash
cd backend
npm install
```

- Crie `.env` com base em `.env.example`.
- Configure SQLite e execute migração inicial:

```bash
npx prisma migrate dev --name init
```

- Inicie o servidor:

```bash
npm run dev
```

#### Front-end (React)

```bash
cd ../frontend
npm install
```

- Crie `.env` com `VITE_API_URL=http://localhost:3000`.
- Inicie a aplicação:

```bash
npm run dev
```

---

## Desenvolvimento

### Arquitetura
- **Back-end (Node.js + Fastify)**: API CRUD com validação e filtros usando Prisma + SQLite.
- **Front-end (React)**: lógica de API encapsulada em `todosApi.ts` para separação de responsabilidades.

### Melhorias de Qualidade
- **Validação de dados** com Zod.
- **Tratamento de erros** padronizado com códigos HTTP.
- **Estilos consistentes** com TailwindCSS.

---

## Testes
Planejado para:
- Funções de filtro (helpers)
- Componentes principais (add/toggle/delete)

---

## Deploy
- Front-end pode ser publicado em **Vercel** ou **Netlify**.
- Configure `VITE_API_URL` no ambiente de produção para comunicação com a API.
