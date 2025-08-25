import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

function Header({ theme, toggleTheme, user, onLogout }) {
  return (
    <header className={`relative p-6 flex items-center justify-between shadow-lg overflow-hidden transition-all duration-500 ${
      theme === "dark" ? "bg-dark-chocolate" : "bg-orange-50"
    }`}>
      {/* Logo menor */}
      <img src="/LogoBolo.png" alt="Logo ByteCake" className="h-20 w-auto max-w-md z-10 relative transform hover:scale-105 transition-transform duration-300" />

      {/* Título centralizado */}
      <h1 className={`absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold z-10 transition-colors duration-500 ${
        theme === "dark" ? "text-cream-text drop-shadow-lg" : "text-amber-800 drop-shadow-md"
      }`}>
        Lista de tarefas
      </h1>

      {/* Área de usuário e controles */}
      <div className="flex items-center gap-4 z-10 relative">
        {user && (
          <div className={`text-sm font-medium ${
            theme === "dark" ? "text-cream-text" : "text-amber-800"
          }`}>
            Olá, {user.email.split('@')[0]}! 🍰
          </div>
        )}
        
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg ${
            theme === "dark" ? "bg-bubblegum hover:bg-strawberry" : "bg-pink-200 hover:bg-pink-300"
          }`}
        >
          <div className="transition-transform duration-500">
            {theme === "light" ? <FaMoon className="text-yellow-500" /> : <FaSun className="text-yellow-400" />}
          </div>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
              theme === "dark" ? "bg-strawberry hover:bg-bubblegum text-cream-text" : "bg-rose-300 hover:bg-rose-400 text-white"
            }`}
          >
            Sair
          </button>
        )}
      </div>

      {/* Ondas suaves */}
      <div className={`absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t to-transparent rounded-t-full pointer-events-none transition-colors duration-500 ${
        theme === "dark" ? "from-dark-chocolate" : "from-orange-50"
      }`}></div>
    </header>
  );
}

export default Header;
