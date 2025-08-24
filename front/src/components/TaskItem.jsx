import React from "react";

function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <li
      className={`flex justify-between items-center p-2 mb-2 rounded-md ${
        task.completed ? "bg-pink-100 text-gray-400 line-through" : "bg-white"
      } border border-pink-200 hover:bg-pink-50 transition-colors cursor-pointer`}
    >
      <span onClick={() => toggleTask(task.id)}>{task.title}</span>
      <button
        onClick={() => deleteTask(task.id)}
        className="text-red-500 hover:text-red-700 font-bold"
      >
        X
      </button>
    </li>
  );
}

export default TaskItem;
