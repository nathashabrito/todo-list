import { useState, useEffect } from "react";
import Header from "./components/Header";
import ConfirmModal from "./components/ConfirmModal";
import Login from "./components/Login";
import Register from "./components/Register";
import apiService from "./services/api";

function App() {
  const [theme, setTheme] = useState("light");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskToRemove, setTaskToRemove] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskCategory, setTaskCategory] = useState('pessoal');
  const [showClearModal, setShowClearModal] = useState(false);
  const [inputError, setInputError] = useState("");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const filteredTasks = tasks.filter((task) => {
    // Filtro por status
    let statusMatch = true;
    if (filter === "completed") statusMatch = task.completed;
    if (filter === "active") statusMatch = !task.completed;
    
    // Filtro por busca (título ou categoria)
    const searchMatch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && searchMatch;
  }).sort((a, b) => {
    // Ordenar por prioridade (alta -> média -> baixa) e depois por data de criação
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority] || 2;
    const bPriority = priorityOrder[b.priority] || 2;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Se mesma prioridade, ordenar por data limite (mais próxima primeiro)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Por último, por data de criação (mais recente primeiro)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = !task.completed;
    
    // Atualizar imediatamente no estado local para feedback visual
    setTasks(prevTasks =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, completed: newStatus } : t
      )
    );
    
    try {
      const updatedTask = await apiService.updateTask(id, { completed: newStatus });
      // Atualizar com a resposta do backend
      setTasks(prevTasks =>
        prevTasks.map((t) =>
          t.id === id ? { ...updatedTask, id: t.id } : t
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const removeTask = (id) => {
    setTaskToRemove(id);
    setShowModal(true);
  };

  const confirmRemove = async () => {
    if (isDeletingTask) return;
    
    setIsDeletingTask(true);
    
    // Remover imediatamente da interface para feedback visual
    const taskIdToRemove = taskToRemove;
    setTasks(prevTasks => prevTasks.filter((task) => task.id !== taskIdToRemove));
    setShowModal(false);
    setTaskToRemove(null);
    
    try {
      await apiService.deleteTask(taskIdToRemove);
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    } finally {
      setIsDeletingTask(false);
    }
  };

  const cancelRemove = () => {
    setShowModal(false);
    setTaskToRemove(null);
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const saveEdit = async (taskId) => {
    if (editingText.trim() === "") {
      cancelEditing();
      return;
    }

    const newTitle = editingText.trim();
    
    // Atualizar imediatamente na interface
    setTasks(prevTasks =>
      prevTasks.map(t => t.id === taskId ? { ...t, title: newTitle } : t)
    );
    
    setEditingTaskId(null);
    setEditingText("");

    try {
      await apiService.updateTask(taskId, { title: newTitle });
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
    }
  };

  const handleEditKeyPress = (e, taskId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit(taskId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Drag & Drop
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.id === targetTask.id) return;
    
    const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = tasks.findIndex(t => t.id === targetTask.id);
    
    const newTasks = [...tasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    
    setTasks(newTasks);
    setDraggedTask(null);
  };

  // Atalhos de teclado globais
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'k':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
          case 'n':
            e.preventDefault();
            document.getElementById('new-task-input')?.focus();
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Marcar todas como concluídas
  const toggleAllTasks = () => {
    const allCompleted = tasks.every(task => task.completed);
    const newStatus = !allCompleted;
    
    setTasks(prevTasks => 
      prevTasks.map(task => ({ ...task, completed: newStatus }))
    );
  };

  // Limpar tarefas concluídas
  const clearCompleted = () => {
    setShowClearModal(true);
  };

  const confirmClearCompleted = () => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    setShowClearModal(false);
  };

  const cancelClearCompleted = () => {
    setShowClearModal(false);
  };

  // Verificar autenticação ao carregar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setUser({ email: 'usuario@exemplo.com', name: 'Usuário' });
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await apiService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const handleLogin = (user) => {
    setUser(user);
    setIsAuthenticated(true);
    setShowRegister(false);
    loadTasks();
  };

  const handleRegister = (user) => {
    setUser(user);
    setIsAuthenticated(true);
    setShowRegister(false);
    loadTasks();
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    setTasks([]);
  };

  const addTask = async () => {
    const taskText = newTask.trim();
    
    if (taskText === "") {
      setInputError("É necessário preencher o campo da tarefa! 📝");
      setTimeout(() => setInputError(""), 3000);
      return;
    }
    
    if (isAddingTask) {
      return;
    }
    
    setInputError(""); // Limpar erro se houver texto
    
    setIsAddingTask(true);
    setNewTask(""); // Limpar imediatamente para feedback visual
    
    // Criar tarefa local imediatamente para feedback visual
    const tempTask = {
      id: 'temp-' + Date.now(),
      title: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: taskPriority,
      dueDate: taskDueDate || null,
      category: taskCategory
    };
    setTasks(prevTasks => [...prevTasks, tempTask]);
    
    try {
      const task = await apiService.createTask(taskText);
      // Substituir tarefa temporária pela real
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === tempTask.id ? { ...task, id: task.id || tempTask.id } : t)
      );
      // Limpar campos
      setTaskPriority('medium');
      setTaskDueDate('');
      setTaskCategory('pessoal');
      setShowAdvanced(false);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      // Manter a tarefa local se o backend falhar
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === tempTask.id ? { ...tempTask, id: Date.now().toString() } : t)
      );
      // Limpar campos mesmo com erro
      setTaskPriority('medium');
      setTaskDueDate('');
      setTaskCategory('pessoal');
      setShowAdvanced(false);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  };

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  // Se não estiver autenticado, mostrar tela de login ou cadastro
  if (!isAuthenticated) {
    return (
      <div className={theme === "dark" ? "dark" : ""}>
        {showRegister ? (
          <Register 
            theme={theme} 
            toggleTheme={toggleTheme} 
            onRegister={handleRegister}
            onBackToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login 
            theme={theme} 
            toggleTheme={toggleTheme} 
            onLogin={handleLogin}
            onGoToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onLogout={handleLogout} />

      <div className={`min-h-screen flex flex-col items-center justify-start p-3 sm:p-6 transition-colors duration-500 ${
        theme === "dark" ? "bg-dark-chocolate" : "bg-brown-pastel"
      }`}>
        <div className={`w-full max-w-3xl rounded-2xl shadow-2xl p-4 sm:p-8 backdrop-blur-sm transition-all duration-500 transform hover:scale-[1.01] ${
          theme === "dark" ? "bg-cocoa text-cream-text border border-marshmallow/20" : "bg-rose-50 text-gray-900 border border-rose-200/30"
        }`}>
          {/* Campo de busca */}
          <div className="mb-6">
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Buscar suas tarefas docinhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-3 pl-10 pr-10 rounded-2xl border-0 transition-all duration-300 focus:outline-none focus:ring-1 text-sm shadow-sm ${
                  theme === "dark" 
                    ? "bg-cocoa/30 text-cream-text placeholder-muted-pink/60 focus:ring-bubblegum/50 focus:bg-cocoa/50" 
                    : "bg-white/70 backdrop-blur-sm placeholder-gray-400 focus:ring-rose-200 focus:bg-white"
                }`}
              />
              <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                searchTerm ? (theme === "dark" ? "text-bubblegum" : "text-rose-400") : "text-gray-400"
              }`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                    theme === "dark" ? "text-muted-pink hover:text-strawberry" : "text-gray-400 hover:text-rose-500"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            
            {/* Atalho sutil */}
            {!searchTerm && (
              <div className={`text-xs text-center mt-2 opacity-50 ${
                theme === "dark" ? "text-cream-text" : "text-gray-500"
              }`}>
                Pressione Ctrl+K para buscar rapidamente
              </div>
            )}
          </div>

          {/* Input e botão */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                id="new-task-input"
                type="text"
                className={`flex-1 p-3 sm:p-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-[1.02] shadow-md text-sm sm:text-base ${
                  theme === "dark" 
                    ? "bg-dark-chocolate border-marshmallow/50 text-cream-text placeholder-muted-pink focus:ring-bubblegum focus:border-bubblegum" 
                    : "border-rose-200 focus:ring-rose-300 focus:border-rose-300"
                }`}
                placeholder="✨ Nova tarefa docinha... (Ctrl+N)"
                value={newTask}
                onChange={(e) => {
                  setNewTask(e.target.value);
                  if (inputError) setInputError("");
                }}
                onKeyPress={handleKeyPress}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`px-3 py-3 rounded-xl transition-all duration-300 text-sm ${
                    showAdvanced
                      ? (theme === "dark" ? "bg-bubblegum text-cream-text" : "bg-rose-300 text-white")
                      : (theme === "dark" ? "bg-soft-pink text-cocoa hover:bg-marshmallow" : "bg-rose-100 hover:bg-rose-200")
                  }`}
                >
                  ⚙️
                </button>
                <button
                  className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg active:scale-95 text-sm sm:text-base whitespace-nowrap ${
                    theme === "dark" 
                      ? "bg-bubblegum hover:bg-strawberry text-cream-text hover:shadow-bubblegum/30" 
                      : "bg-rose-200 hover:bg-rose-300 text-white hover:shadow-rose-300/30"
                  }`}
                  onClick={addTask}
                >
                  Adicionar
                </button>
              </div>
            </div>
            
            {/* Mensagem de erro */}
            {inputError && (
              <div className={`text-xs text-center p-2 rounded-lg mb-3 transition-all duration-300 ${
                theme === "dark" ? "bg-rose-900/30 text-rose-300" : "bg-pink-100 text-pink-700"
              }`}>
                {inputError}
              </div>
            )}
            
            {/* Campos avançados */}
            {showAdvanced && (
              <div className={`p-4 rounded-xl border transition-all duration-300 ${
                theme === "dark" ? "bg-cocoa/30 border-marshmallow/20" : "bg-rose-50/50 border-rose-200/50"
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Prioridade */}
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      theme === "dark" ? "text-cream-text" : "text-gray-700"
                    }`}>
                      Prioridade
                    </label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-sm ${
                        theme === "dark" 
                          ? "bg-dark-chocolate border-marshmallow/50 text-cream-text" 
                          : "border-rose-200 bg-white"
                      }`}
                    >
                      <option value="low">🟢 Baixa</option>
                      <option value="medium">🟡 Média</option>
                      <option value="high">🔴 Alta</option>
                    </select>
                  </div>
                  
                  {/* Data */}
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      theme === "dark" ? "text-cream-text" : "text-gray-700"
                    }`}>
                      Data limite
                    </label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-sm ${
                        theme === "dark" 
                          ? "bg-dark-chocolate border-marshmallow/50 text-cream-text" 
                          : "border-rose-200 bg-white"
                      }`}
                    />
                  </div>
                  
                  {/* Categoria */}
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      theme === "dark" ? "text-cream-text" : "text-gray-700"
                    }`}>
                      Categoria
                    </label>
                    <select
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-sm ${
                        theme === "dark" 
                          ? "bg-dark-chocolate border-marshmallow/50 text-cream-text" 
                          : "border-rose-200 bg-white"
                      }`}
                    >
                      <option value="pessoal">👤 Pessoal</option>
                      <option value="trabalho">💼 Trabalho</option>
                      <option value="estudos">📚 Estudos</option>
                      <option value="casa">🏠 Casa</option>
                      <option value="saude">💊 Saúde</option>
                      <option value="lazer">🎮 Lazer</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ações em massa */}
          {tasks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button
                onClick={toggleAllTasks}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                  theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200"
                }`}
              >
                {tasks.every(t => t.completed) ? "↺ Desmarcar todas" : "✓ Marcar todas"}
              </button>
              {tasks.some(t => t.completed) && (
                <button
                  onClick={clearCompleted}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                    theme === "dark" ? "bg-muted-pink/20 hover:bg-muted-pink/30 text-muted-pink" : "bg-pink-100 hover:bg-pink-200 text-pink-600"
                  }`}
                >
                  🗑️ Limpar concluídas ({tasks.filter(t => t.completed).length})
                </button>
              )}
            </div>
          )}

          {/* Filtros */}
          <div className="mb-6 sm:mb-8">
            {/* Filtros principais */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
            <button
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base ${
                filter === "all" 
                  ? (theme === "dark" ? "bg-bubblegum text-cream-text shadow-bubblegum/30" : "bg-rose-200 shadow-rose-200/30") 
                  : (theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200")
              }`}
              onClick={() => setFilter("all")}
            >
              Todas
            </button>
            <button
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base ${
                filter === "active"
                  ? (theme === "dark" ? "bg-bubblegum text-cream-text shadow-bubblegum/30" : "bg-rose-200 shadow-rose-200/30")
                  : (theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200")
              }`}
              onClick={() => setFilter("active")}
            >
              Ativas
            </button>
            <button
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base ${
                filter === "completed"
                  ? (theme === "dark" ? "bg-bubblegum text-cream-text shadow-bubblegum/30" : "bg-rose-200 shadow-rose-200/30")
                  : (theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200")
              }`}
              onClick={() => setFilter("completed")}
            >
              Concluídas
            </button>
            </div>
            
            {/* Filtros por categoria */}
            {tasks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {['pessoal', 'trabalho', 'estudos', 'casa', 'saude', 'lazer'].map(cat => {
                  const count = tasks.filter(t => t.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSearchTerm(cat)}
                      className={`px-2 py-1 rounded-full transition-all duration-300 ${
                        searchTerm === cat
                          ? (theme === "dark" ? "bg-bubblegum text-cream-text" : "bg-rose-300 text-white")
                          : (theme === "dark" ? "bg-cocoa/30 text-muted-pink hover:bg-cocoa/50" : "bg-gray-100 hover:bg-gray-200")
                      }`}
                    >
                      {cat === 'pessoal' && '👤'}
                      {cat === 'trabalho' && '💼'}
                      {cat === 'estudos' && '📚'}
                      {cat === 'casa' && '🏠'}
                      {cat === 'saude' && '💊'}
                      {cat === 'lazer' && '🎮'}
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Barra de progresso */}
          {total > 0 && (
            <div className={`mb-4 p-3 rounded-xl transition-all duration-300 ${
              theme === "dark" ? "bg-cocoa/20" : "bg-stone-100/70"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${
                  theme === "dark" ? "text-cream-text" : "text-stone-700"
                }`}>
                  {Math.round((completed / total) * 100)}% concluído
                </span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${
                theme === "dark" ? "bg-dark-chocolate/50" : "bg-stone-200"
              }`}>
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    theme === "dark" ? "bg-bubblegum" : "bg-stone-500"
                  }`}
                  style={{ width: `${(completed / total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Contador de resultados */}
          {searchTerm && (
            <div className={`text-center text-sm mb-4 ${
              theme === "dark" ? "text-muted-pink" : "text-gray-600"
            }`}>
              {filteredTasks.length} tarefa(s) encontrada(s) para "{searchTerm}"
            </div>
          )}

          {/* Lista de tarefas */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className={`text-center py-12 ${
                theme === "dark" ? "text-muted-pink" : "text-gray-500"
              }`}>
                {searchTerm ? (
                  <div>
                    <div className="text-4xl mb-4">🔍</div>
                    <p>Nenhuma tarefa encontrada para "{searchTerm}"</p>
                    <button 
                      onClick={() => setSearchTerm("")}
                      className={`mt-2 px-4 py-2 rounded-full text-sm transition-all ${
                        theme === "dark" ? "bg-bubblegum text-cream-text" : "bg-rose-200 text-white"
                      }`}
                    >
                      Limpar busca
                    </button>
                  </div>
                ) : tasks.length === 0 ? (
                  <div>
                    <div className="text-6xl mb-4">🍰</div>
                    <p className="text-lg mb-2">Nenhuma tarefa ainda!</p>
                    <p className="text-sm">Que tal adicionar sua primeira tarefa docinha?</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-4">✨</div>
                    <p>Nenhuma tarefa {filter === "completed" ? "concluída" : "ativa"}</p>
                  </div>
                )}
              </div>
            ) : (
              filteredTasks.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, task)}
                className={`flex items-center justify-between p-3 sm:p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg group ${
                  draggedTask?.id === task.id ? "opacity-50 scale-95" : ""
                } ${
                  task.completed 
                    ? (theme === "dark" ? "line-through text-muted-pink bg-rose-900/30 opacity-75" : "line-through text-gray-600 opacity-85")
                    : (theme === "dark" ? "text-rose-800 hover:shadow-pink-200/30" : "bg-rose-200 hover:bg-rose-300 hover:shadow-rose-300/30")
                }`}
                onMouseEnter={(e) => {
                  if (!task.completed && theme === "dark") {
                    e.currentTarget.style.backgroundColor = '#F8BBD9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!task.completed && theme === "dark") {
                    e.currentTarget.style.backgroundColor = '#D4A89E';
                  }
                }}
                onClick={() => toggleTask(task.id)}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  ...(task.completed && theme === "light" && {
                    backgroundColor: '#B2A99F'
                  }),
                  ...(!task.completed && theme === "dark" && {
                    backgroundColor: '#D4A89E'
                  }),
                  ...(!task.completed && theme === "dark" && {
                    '--hover-bg': '#F8BBD9'
                  })
                }}
              >
                {/* Lado esquerdo: bolinha + conteúdo */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 h-8">
                    <span className="text-gray-400 text-xs">≡</span>
                    <span className={`w-3 h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                      task.completed 
                        ? (theme === "dark" ? "bg-rose-800" : "bg-stone-500")
                        : (theme === "dark" ? "bg-rose-600" : "bg-pink-300")
                    }`}></span>
                  </div>
                  
                  {/* Conteúdo da tarefa */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[2rem]">
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                      onBlur={() => saveEdit(task.id)}
                      className={`flex-1 p-1 rounded border text-sm sm:text-base ${
                        theme === "dark" 
                          ? "bg-dark-chocolate border-marshmallow/50 text-cream-text" 
                          : "border-rose-200 bg-white"
                      }`}
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span 
                          className="text-base sm:text-lg font-medium break-words cursor-text flex-1"
                          onDoubleClick={() => startEditing(task)}
                        >
                          {task.title}
                        </span>
                        {/* Prioridade */}
                        {task.priority && (
                          <span className="text-base flex-shrink-0 filter brightness-110 contrast-125">
                            {task.priority === 'high' && '🔴'}
                            {task.priority === 'medium' && '🟡'}
                            {task.priority === 'low' && '🟢'}
                          </span>
                        )}
                      </div>
                      
                      {/* Metadados */}
                      <div className={`flex flex-wrap items-center gap-3 text-xs mt-2 ${
                        theme === "dark" ? "text-stone-700 opacity-90" : "text-gray-600 opacity-70"
                      }`}>
                        {/* Categoria */}
                        {task.category && (
                          <span className="flex items-center gap-1">
                            {task.category === 'pessoal' && '👤'}
                            {task.category === 'trabalho' && '💼'}
                            {task.category === 'estudos' && '📚'}
                            {task.category === 'casa' && '🏠'}
                            {task.category === 'saude' && '💊'}
                            {task.category === 'lazer' && '🎮'}
                            {task.category}
                          </span>
                        )}
                        
                        {/* Data limite */}
                        {task.dueDate && (
                          <span className={`flex items-center gap-1 ${
                            new Date(task.dueDate) < new Date() && !task.completed
                              ? (theme === "dark" ? "text-bubblegum font-medium" : "text-rose-400 font-medium")
                              : ""
                          }`}>
                            📅 {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        
                        {/* Data de criação */}
                        {task.createdAt && (
                          <span className="flex items-center gap-1">
                            ⏰ {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
                
                {/* Botões de ação */}
                <div className="flex items-center gap-1 ml-2 sm:ml-4 h-8">
                  {editingTaskId === task.id ? (
                    <>
                      <button
                        className={`p-1 sm:p-2 rounded-full transition-all duration-300 transform hover:scale-110 flex-shrink-0 ${
                          theme === "dark" ? "text-amber-800 hover:bg-amber-800/20" : "text-green-500 hover:bg-green-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit(task.id);
                        }}
                      >
                        ✓
                      </button>
                      <button
                        className={`p-1 sm:p-2 rounded-full transition-all duration-300 transform hover:scale-110 flex-shrink-0 ${
                          theme === "dark" ? "text-amber-800 hover:bg-amber-800/20" : "text-gray-500 hover:bg-gray-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEditing();
                        }}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={`p-1 sm:p-2 rounded-full transition-all duration-300 transform hover:scale-110 opacity-70 sm:opacity-0 group-hover:opacity-100 flex-shrink-0 ${
                          theme === "dark" ? "text-amber-800 hover:bg-amber-800/20" : "text-blue-500 hover:bg-blue-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(task);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className={`p-1 sm:p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90 opacity-0 group-hover:opacity-100 flex-shrink-0 ${
                          theme === "dark" ? "text-amber-800 hover:bg-amber-800/20" : "text-red-500 hover:bg-red-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTask(task.id);
                        }}
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
              ))
            )}
          </div>

          {/* Contagem e dicas */}
          <div className={`mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl text-center font-medium transition-all duration-300 ${
            theme === "dark" ? "text-muted-pink bg-dark-chocolate/30" : "text-gray-600 bg-rose-100/50"
          }`}>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm mb-3">
              <span className="flex items-center gap-1 sm:gap-2">
                🍰 <strong>{total}</strong> Total
              </span>
              <span className="flex items-center gap-1 sm:gap-2">
                ✨ <strong>{completed}</strong> Concluídas
              </span>
              <span className="flex items-center gap-1 sm:gap-2">
                🔥 <strong>{pending}</strong> Pendentes
              </span>
              {searchTerm && (
                <span className="flex items-center gap-1 sm:gap-2">
                  🔍 <strong>{filteredTasks.length}</strong> Filtradas
                </span>
              )}
            </div>
            
            {/* Dicas de uso */}
            <div className={`text-xs opacity-70 ${
              theme === "dark" ? "text-cream-text" : "text-gray-500"
            }`}>
              💡 Dicas: Duplo clique para editar • Arraste para reordenar • Ctrl+K para buscar • Ctrl+N para nova tarefa
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showModal}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        message="Tem certeza que quer remover esta tarefa docinha? 🧁"
      />
      
      <ConfirmModal
        isOpen={showClearModal}
        onConfirm={confirmClearCompleted}
        onCancel={cancelClearCompleted}
        message={`Tem certeza que quer limpar todas as ${tasks.filter(t => t.completed).length} tarefas concluídas? 🧽 Esta ação não pode ser desfeita!`}
      />
    </div>
  );
}

export default App;