export default function TaskList({ tasks, toggleTask, deleteTask }) {
  if (tasks.length === 0) return <p className="text-pink-500">Nenhuma tarefa aqui! 🌸</p>;

  return (
    <ul className="w-full">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center p-2 mb-2 bg-white border-l-4 border-pink-300 rounded shadow-sm"
        >
          <span
            onClick={() => toggleTask(task.id)}
            className={`flex-1 cursor-pointer ${
              task.completed ? "line-through text-pink-300" : "text-pink-900"
            }`}
          >
            {task.title}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-pink-700 hover:text-red-500 font-bold"
          >
            &times;
          </button>
        </li>
      ))}
    </ul>
  );
}
