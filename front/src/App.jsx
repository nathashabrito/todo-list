import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Comprar ingredientes", completed: true },
    { id: 2, title: "Lavar a louça", completed: false },
    { id: 3, title: "Enviar relatório", completed: false },
    { id: 4, title: "Estudar React", completed: false },
  ]);

  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
    setNewTask("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#8B5E3C] p-6">
      <div className="w-full max-w-3xl bg-rose-50 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-rose-400 mb-6 text-center">To Do List</h1>

        {/* Input e botão */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            placeholder="Nova tarefa..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="bg-rose-200 hover:bg-rose-300 text-white px-5 py-3 rounded-xl font-semibold"
            onClick={addTask}
          >
            Adicionar
          </button>
        </div>

        {/* Filtros */}
        <div className="flex justify-between mb-6">
          <button
            className={`px-4 py-2 rounded-xl ${filter === "all" ? "bg-rose-200" : "bg-rose-100 hover:bg-rose-200"}`}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={`px-4 py-2 rounded-xl ${filter === "active" ? "bg-rose-200" : "bg-rose-100 hover:bg-rose-200"}`}
            onClick={() => setFilter("active")}
          >
            Ativas
          </button>
          <button
            className={`px-4 py-2 rounded-xl ${filter === "completed" ? "bg-rose-200" : "bg-rose-100 hover:bg-rose-200"}`}
            onClick={() => setFilter("completed")}
          >
            Concluídas
          </button>
        </div>

        {/* Lista de tarefas */}
        <ul>
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-4 mb-3 rounded-xl cursor-pointer 
                ${task.completed ? "line-through text-gray-400 bg-rose-100" : "bg-rose-200 hover:bg-rose-300"}`}
              onClick={() => toggleTask(task.id)}
            >
              {task.title}
              <button
                className="ml-4 text-red-500 hover:text-red-700"
                onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Contagem */}
        <div className="mt-8 text-center text-gray-600 font-medium">
          Total: {total} | Concluídas: {completed} | Pendentes: {pending}
        </div>
      </div>
    </div>
  );
}

export default App;
