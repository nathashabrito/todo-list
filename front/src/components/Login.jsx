import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiService from "../services/api";

function Login({ theme, toggleTheme, onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiService.login(email, password);
      onLogin(response.user || { email });
    } catch (error) {
      setError("Email ou senha inválidos. Tente novamente.");
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
      theme === "dark" ? "bg-dark-chocolate" : "bg-brown-pastel"
    }`}>
      {/* Botão de tema no canto */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg z-10 ${
          theme === "dark" ? "bg-bubblegum hover:bg-strawberry" : "bg-pink-200 hover:bg-pink-300"
        }`}
      >
        <div className="transition-transform duration-500">
          {theme === "light" ? <FaEyeSlash className="text-yellow-500" /> : <FaEye className="text-yellow-400" />}
        </div>
      </button>

      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-500 transform hover:scale-[1.02] ${
        theme === "dark" ? "bg-cocoa text-cream-text border border-marshmallow/20" : "bg-rose-50 text-gray-900 border border-rose-200/30"
      }`}>
        
        {/* Logo e título */}
        <div className="text-center mb-8">
          <img src="/LogoBolo.png" alt="Logo ByteCake" className="h-16 mx-auto mb-4 transform hover:scale-105 transition-transform duration-300" />
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === "dark" ? "text-cream-text" : "text-amber-800"
          }`}>
            Bem-vinda! 🍰
          </h1>
          <p className={`text-sm ${
            theme === "dark" ? "text-muted-pink" : "text-gray-600"
          }`}>
            Entre na sua conta docinha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-cream-text" : "text-gray-700"
            }`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-[1.02] shadow-md ${
                theme === "dark" 
                  ? "bg-dark-chocolate border-marshmallow/50 text-cream-text placeholder-muted-pink focus:ring-bubblegum focus:border-bubblegum" 
                  : "border-rose-200 focus:ring-rose-300 focus:border-rose-300"
              }`}
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-cream-text" : "text-gray-700"
            }`}>
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-4 pr-12 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-[1.02] shadow-md ${
                  theme === "dark" 
                    ? "bg-dark-chocolate border-marshmallow/50 text-cream-text placeholder-muted-pink focus:ring-bubblegum focus:border-bubblegum" 
                    : "border-rose-200 focus:ring-rose-300 focus:border-rose-300"
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  theme === "dark" ? "text-muted-pink hover:text-bubblegum" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className={`p-3 rounded-xl text-sm text-center ${
              theme === "dark" ? "bg-strawberry/20 text-strawberry" : "bg-red-100 text-red-600"
            }`}>
              {error}
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === "dark" 
                ? "bg-bubblegum hover:bg-strawberry text-cream-text hover:shadow-bubblegum/30" 
                : "bg-rose-200 hover:bg-rose-300 text-white hover:shadow-rose-300/30"
            }`}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Links extras */}
        <div className="mt-6 text-center space-y-2">
          <button className={`text-sm transition-colors ${
            theme === "dark" ? "text-muted-pink hover:text-bubblegum" : "text-gray-600 hover:text-rose-500"
          }`}>
            Esqueceu sua senha?
          </button>
          <div className={`text-sm ${
            theme === "dark" ? "text-muted-pink" : "text-gray-600"
          }`}>
            Não tem conta? 
            <button 
              onClick={onGoToRegister}
              className={`ml-1 font-medium transition-colors ${
                theme === "dark" ? "text-bubblegum hover:text-strawberry" : "text-rose-500 hover:text-rose-600"
              }`}
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;