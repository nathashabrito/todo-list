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
  
  // Novas funcionalidades
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newTaskCategory, setNewTaskCategory] = useState("pessoal");
  const [showProgress, setShowProgress] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [showStats, setShowStats] = useState(true);

  const categories = [
    { id: "pessoal", name: "Pessoal", color: "bg-pink-500", emoji: "💖" },
    { id: "trabalho", name: "Trabalho", color: "bg-blue-500", emoji: "💼" },
    { id: "estudos", name: "Estudos", color: "bg-green-500", emoji: "📚" },
    { id: "casa", name: "Casa", color: "bg-yellow-500", emoji: "🏠" },
    { id: "saude", name: "Saúde", color: "bg-red-500", emoji: "🏥" },
    { id: "lazer", name: "Lazer", color: "bg-purple-500", emoji: "🎉" }
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const filteredTasks = tasks.filter((task) => {
    let statusMatch = true;
    if (filter === "completed") statusMatch = task.completed;
    if (filter === "active") statusMatch = !task.completed;
    
    let categoryMatch = selectedCategory === "all" || task.category === selectedCategory;
    let searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && categoryMatch && searchMatch;
  }).sort((a, b) => {
    if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
    if (sortBy === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  const progressPercentage = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    try {
      const updatedTask = await apiService.updateTask(id, { completed: !task.completed });
      setTasks(tasks.map((t) => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const removeTask = (id) => {
    setTaskToRemove(id);
    setShowModal(true);
  };

  const confirmRemove = async () => {
    try {
      await apiService.deleteTask(taskToRemove);
      setTasks(tasks.filter((task) => task.id !== taskToRemove));
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
    setShowModal(false);
    setTaskToRemove(null);
  };

  const cancelRemove = () => {
    setShowModal(false);
    setTaskToRemove(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
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
    if (newTask.trim() === "") return;
    try {
      const task = await apiService.createTask({
        title: newTask,
        category: newTaskCategory
      });
      setTasks([...tasks, task]);
      setNewTask("");
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getTasksByCategory = () => {
    return categories.map(cat => ({
      ...cat,
      count: tasks.filter(t => t.category === cat.id).length,
      completed: tasks.filter(t => t.category === cat.id && t.completed).length
    }));
  };

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

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

      <div className={`min-h-screen flex flex-col items-center justify-start p-6 transition-colors duration-500 ${
        theme === "dark" ? "bg-dark-chocolate" : "bg-brown-pastel"
      }`}>
        <div className={`w-full max-w-4xl rounded-2xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 transform hover:scale-[1.01] ${
          theme === "dark" ? "bg-cocoa text-cream-text border border-marshmallow/20" : "bg-rose-50 text-gray-900 border border-rose-200/30"
        }`}>
          
          {/* Controles de Visualização */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setShowProgress(!showProgress)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  showProgress ? "bg-rose-200 text-rose-800" : "bg-gray-200 text-gray-600"
                }`}
              >
                📊 Progresso
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  showStats ? "bg-rose-200 text-rose-800" : "bg-gray-200 text-gray-600"
                }`}
              >
                📈 Estatísticas
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-1 rounded-lg text-sm ${
                theme === "dark" ? "bg-dark-chocolate text-cream-text" : "bg-white"
              }`}
            >
              <option value="date">📅 Data</option>
              <option value="alphabetical">🔤 A-Z</option>
              <option value="category">📂 Categoria</option>
            </select>
          </div>

          {/* Barra de Pesquisa */}
          <div className="mb-6">
            <input
              type="text"
              className={`w-full p-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-[1.01] shadow-md ${
                theme === "dark" 
                  ? "bg-dark-chocolate border-marshmallow/50 text-cream-text placeholder-muted-pink focus:ring-bubblegum focus:border-bubblegum" 
                  : "border-rose-200 focus:ring-rose-300 focus:border-rose-300"
              }`}
              placeholder="🔍 Pesquisar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Barra de Progresso */}
          {showProgress && (
            <div className={`mb-6 p-4 rounded-xl ${
              theme === "dark" ? "bg-dark-chocolate/30" : "bg-rose-100/50"
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${
                  theme === "dark" ? "text-cream-text" : "text-gray-700"
                }`}>Progresso Geral</span>
                <span className={`font-bold ${
                  theme === "dark" ? "text-bubblegum" : "text-rose-600"
                }`}>{progressPercentage}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${
                theme === "dark" ? "bg-cocoa" : "bg-rose-200"
              }`}>
                <div 
                  className={`h-full transition-all duration-500 ${
                    theme === "dark" ? "bg-gradient-to-r from-bubblegum to-strawberry" : "bg-gradient-to-r from-rose-400 to-pink-500"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Estatísticas por Categoria */}
          {showStats && (
            <div className={`mb-6 p-4 rounded-xl ${
              theme === "dark" ? "bg-dark-chocolate/30" : "bg-rose-100/50"
            }`}>
              <h3 className={`font-medium mb-3 ${
                theme === "dark" ? "text-cream-text" : "text-gray-700"
              }`}>📊 Estatísticas por Categoria</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {getTasksByCategory().map(cat => (
                  <div key={cat.id} className={`p-2 rounded-lg ${
                    theme === "dark" ? "bg-cocoa" : "bg-white"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {cat.completed}/{cat.count} concluídas
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input e botão */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                className={`flex-1 p-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-[1.02] shadow-md ${
                  theme === "dark" 
                    ? "bg-dark-chocolate border-marshmallow/50 text-cream-text placeholder-muted-pink focus:ring-bubblegum focus:border-bubblegum" 
                    : "border-rose-200 focus:ring-rose-300 focus:border-rose-300"
                }`}
                placeholder="✨ Nova tarefa docinha..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className={`p-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 shadow-md ${
                  theme === "dark" 
                    ? "bg-dark-chocolate border-marshmallow/50 text-cream-text focus:ring-bubblegum focus:border-bubblegum" 
                    : "border-rose-200 focus:ring-rose-300 focus:border-rose-300"
                }`}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                ))}
              </select>
              <button
                className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg active:scale-95 ${
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

          {/* Filtros por Status */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                filter === "all" 
                  ? (theme === "dark" ? "bg-bubblegum text-cream-text shadow-bubblegum/30" : "bg-rose-200 shadow-rose-200/30") 
                  : (theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200")
              }`}
              onClick={() => setFilter("all")}
            >
              Todas
            </button>
            <button
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                filter === "active"
                  ? (theme === "dark" ? "bg-bubblegum text-cream-text shadow-bubblegum/30" : "bg-rose-200 shadow-rose-200/30")
                  : (theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200")
              }`}
              onClick={() => setFilter("active")}
            >
              Ativas
            </button>
            <button
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                filter === "completed"
                  ? (theme === "dark" ? "bg-bubblegum text-cream-text shadow-bubblegum/30" : "bg-rose-200 shadow-rose-200/30")
                  : (theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200")
              }`}
              onClick={() => setFilter("completed")}
            >
              Concluídas
            </button>
          </div>

          {/* Filtros por Categoria */}
          <div className="mb-8">
            <h3 className={`text-center font-medium mb-4 ${
              theme === "dark" ? "text-cream-text" : "text-gray-700"
            }`}>Filtrar por Categoria</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                  selectedCategory === "all" 
                    ? (theme === "dark" ? "bg-bubblegum text-cream-text shadow-bubblegum/30" : "bg-rose-200 shadow-rose-200/30") 
                    : (theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200")
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                🌈 Todas
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                    selectedCategory === cat.id 
                      ? (theme === "dark" ? "bg-bubblegum text-cream-text shadow-bubblegum/30" : "bg-rose-200 shadow-rose-200/30") 
                      : (theme === "dark" ? "bg-soft-pink hover:bg-marshmallow text-cocoa" : "bg-rose-100 hover:bg-rose-200")
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de tarefas */}
          <div className="space-y-3">
            {filteredTasks.map((task, index) => {
              const categoryInfo = getCategoryInfo(task.category);
              return (
                <div
                  key={task.id}
                  className={`flex justify-between items-center p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg group ${
                    task.completed 
                      ? (theme === "dark" ? "line-through text-muted-pink bg-dark-chocolate/50 opacity-75" : "line-through text-gray-600 opacity-95")
                      : (theme === "dark" ? "bg-cream-text hover:bg-soft-pink text-cocoa hover:shadow-marshmallow/30" : "bg-rose-200 hover:bg-rose-300 hover:shadow-rose-300/30")
                  }`}
                  onClick={() => toggleTask(task.id)}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    ...(task.completed && theme === "light" && {
                      backgroundColor: '#B2A99F'
                    })
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      task.completed 
                        ? (theme === "dark" ? "bg-bubblegum" : "bg-purple-500")
                        : (theme === "dark" ? "bg-strawberry" : "bg-pink-300")
                    }`}></span>
                    <span className="text-lg">{categoryInfo.emoji}</span>
                    <span>{task.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryInfo.color} text-white`}>
                      {categoryInfo.name}
                    </span>
                  </span>
                  <button
                    className={`ml-4 p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90 opacity-0 group-hover:opacity-100 ${
                      theme === "dark" ? "text-black bg-yellow-500 hover:bg-yellow-400 shadow-lg border-2 border-yellow-600" : "text-red-500 hover:bg-red-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTask(task.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Contagem */}
          <div className={`mt-8 p-4 rounded-xl text-center font-medium transition-all duration-300 ${
            theme === "dark" ? "text-muted-pink bg-dark-chocolate/30" : "text-gray-600 bg-rose-100/50"
          }`}>
            <div className="flex justify-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                🍰 <strong>{total}</strong> Total
              </span>
              <span className="flex items-center gap-2">
                ✨ <strong>{completed}</strong> Concluídas
              </span>
              <span className="flex items-center gap-2">
                🔥 <strong>{pending}</strong> Pendentes
              </span>
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
    </div>
  );
}

export default App;