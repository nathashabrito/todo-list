export default function FilterButtons({ filter, setFilter }) {
  const buttons = [
    { label: "Todas", value: "all" },
    { label: "Ativas", value: "active" },
    { label: "Concluídas", value: "completed" },
  ];

  return (
    <div className="flex justify-center gap-2 mb-4">
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => setFilter(btn.value)}
          className={`px-4 py-1 rounded-md border ${
            filter === btn.value
              ? "bg-pink-300 text-white border-pink-300"
              : "bg-white text-pink-700 border-pink-300"
          } hover:bg-pink-200`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
