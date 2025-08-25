# 📝 Projeto 7 - Desenvolve Boticário (Front-end)

Este projeto é uma aplicação de lista de tarefas (**To-Do List**) desenvolvida em **React** com **Tailwind CSS**. Foi criado como parte do programa **Desenvolve Boticário**, focando em boas práticas de desenvolvimento front-end, componentização e experiência do usuário.

---

## 🚀 Tecnologias Utilizadas

- **React** - Biblioteca para construção da interface
- **Tailwind CSS** - Estilização baseada em utilitários
- **PostCSS** - Processador de CSS
- **Jest** + **React Testing Library** - Testes unitários
- **Create React App** - Ferramenta para inicialização do projeto


## 🔎 Explicação dos Componentes

**App.jsx**  
Componente raiz que gerencia o estado das tarefas (`tasks`) e do filtro (`filter`).  
Integra `Header`, `Footer`, `TaskInput`, `TaskList` e `FilterButtons`.  
Contém a lógica de adicionar, remover, alternar conclusão e filtrar tarefas.

**Header.jsx**  
Exibe o título principal da aplicação.  
Mantém a identidade visual do app (rosa pastel sofisticado). 🌸

**Footer.jsx**  
Rodapé simples com informações do app.  
Mantém consistência de layout.

**TaskInput.jsx**  
Campo de texto + botão para adicionar tarefas.  
Permite adicionar tarefas pressionando Enter.

**TaskList.jsx**  
Renderiza todas as tarefas filtradas (todas, ativas ou concluídas).  
Usa `TaskItem` para cada tarefa.

**TaskItem.jsx**  
Exibe uma tarefa individual.  
Clique na tarefa alterna entre concluída/ativa.  
Botão "X" para exclusão da tarefa.

**FilterButtons.jsx**  
Botões para alternar filtros de tarefas.  
Destaque visual no botão ativo.

## 📊 Fluxo da Aplicação

1. O usuário insere uma nova tarefa no `TaskInput`.  
2. O estado global de `tasks` é atualizado no `App.jsx`.  
3. A lista exibida em `TaskList` muda conforme o filtro selecionado (`FilterButtons`).  
4. Ao clicar em uma tarefa (`TaskItem`), o status de concluída/pendente é alternado.  
5. O contador de tarefas (total, concluídas, pendentes) se atualiza automaticamente.

## 💡 Como Executar o Projeto

**Pré-requisitos**  
- Node.js  
- Yarn ou NPM  

## 🎨 Identidade Visual
- **Tema:** Rosa pastel, girlie, mas clean  

## 🖥 Layout
- Minimalista e responsivo  

## UX
- Fácil de adicionar, remover e filtrar tarefas  

## 👩‍💻 Observações
- Todos os componentes foram pensados para serem reutilizáveis  
- Código estruturado para facilidade de manutenção  
- Aplicação pronta para evoluir com novas funcionalidades


**Passos**  

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/projeto7-boticario-front.git

# Acesse a pasta do projeto
cd projeto7-boticario-front

# Instale as dependências
yarn install
# ou
npm install

# Execute em ambiente de desenvolvimento
yarn start
# ou
npm start

A aplicação será executada em: 👉 [http://localhost:3000]

## 🧪 Testes

Para rodar os testes unitários:

```bash
yarn test
# ou
npm test

---

## 📂 Estrutura do Projeto

```bash
src/
├── App.css               # Estilos globais
├── App.jsx               # Componente principal
├── App.test.js           # Testes iniciais
├── index.css             # Arquivo de estilos base
├── index.jsx             # Ponto de entrada da aplicação
├── logo.svg              # Logo da aplicação
├── reportWebVitals.js    # Métricas de performance
├── setupTests.js         # Configuração de testes
├── postcss.config.js     # Configuração do PostCSS
├── tailwind.config.js    # Configuração do Tailwind
│
├── styles/               # Estilos adicionais
│
└── components/           # Componentes reutilizáveis
    ├── Header.jsx        # Cabeçalho da aplicação
    ├── Footer.jsx        # Rodapé
    ├── TaskInput.jsx     # Campo de input para nova tarefa
    ├── TaskList.jsx      # Lista de tarefas
    ├── TaskItem.jsx      # Item individual da lista
    └── FilterButtons.jsx # Botões para filtro (Todas, Ativas, Concluídas)
