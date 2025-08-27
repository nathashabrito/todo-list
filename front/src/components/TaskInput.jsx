import { useState } from "react";

export default function TaskInput({ addTask }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Adicionar nova tarefa"
        className="flex-grow p-2 rounded-l-md border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        type="submit"
        className="bg-pink-400 text-white px-4 rounded-r-md hover:bg-pink-500"
      >
        Adicionar
      </button>
    </form>
  );
}
