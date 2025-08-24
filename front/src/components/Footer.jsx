export default function Footer({ total, completed }) {
  return (
    <footer className="w-full py-4 bg-pink-200 text-center mt-8 shadow-inner">
      <p className="text-pink-900">
        Total: {total} | Concluídas: {completed} | Pendentes: {total - completed}
      </p>
    </footer>
  );
}
