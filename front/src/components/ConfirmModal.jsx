import React from "react";

function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cocoa rounded-3xl p-8 shadow-2xl max-w-sm mx-4 border-4 border-marshmallow transform animate-slideUp">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🍰</div>
          <h3 className="text-xl font-bold text-cream-text mb-6 leading-relaxed">
            {message}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onConfirm}
              className="bg-bubblegum hover:bg-strawberry text-cream-text px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg"
            >
              Sim, remover
            </button>
            <button
              onClick={onCancel}
              className="bg-soft-pink hover:bg-marshmallow text-cocoa px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;