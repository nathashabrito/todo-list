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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    try {
      const updatedTask = await apiService.updateTask(id, { completed: !task.completed });
      setTasks(
        tasks.map((t) =>
          t.id === id ? updatedTask : t
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

  // Verificar autenticação ao carregar
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
      const task = await apiService.createTask(newTask);
      setTasks([...tasks, task]);
      setNewTask("");
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
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

      <div className={`min-h-screen flex flex-col items-center justify-start p-6 transition-colors duration-500 ${
        theme === "dark" ? "bg-dark-chocolate" : "bg-brown-pastel"
      }`}>
        <div className={`w-full max-w-3xl rounded-2xl shadow-2xl p-8 backdrop-blur-sm transition-all duration-500 transform hover:scale-[1.01] ${
          theme === "dark" ? "bg-cocoa text-cream-text border border-marshmallow/20" : "bg-rose-50 text-gray-900 border border-rose-200/30"
        }`}>
          {/* Input e botão */}
          <div className="flex gap-3 mb-8">
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
              onKeyDown={handleKeyPress}
            />
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

          {/* Filtros */}
          <div className="flex justify-center gap-4 mb-8">
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

          {/* Lista de tarefas */}
          <div className="space-y-3">
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className={`flex justify-between items-center p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg group ${
                  task.completed 
                    ? (theme === "dark" ? "line-through text-muted-pink bg-dark-chocolate/50 opacity-75" : "line-through text-gray-600 bg-purple-200 opacity-95")
                    : (theme === "dark" ? "bg-marshmallow hover:bg-soft-pink text-cocoa hover:shadow-marshmallow/30" : "bg-rose-200 hover:bg-rose-300 hover:shadow-rose-300/30")
                }`}
                onClick={() => toggleTask(task.id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    task.completed 
                      ? (theme === "dark" ? "bg-bubblegum" : "bg-purple-500")
                      : (theme === "dark" ? "bg-strawberry" : "bg-pink-300")
                  }`}></span>
                  {task.title}
                </span>
                <button
                  className={`ml-4 p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90 opacity-0 group-hover:opacity-100 ${
                    theme === "dark" ? "text-strawberry hover:bg-strawberry/20" : "text-red-500 hover:bg-red-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTask(task.id);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
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
