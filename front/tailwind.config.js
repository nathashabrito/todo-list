// cspell:disable
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: { 50: "#ffe6f0", 100: "#ffcce0", 200: "#ff99c2", 300: "#ff66a3" },
        brown: { 50: "#f5efe6", 100: "#eadfcc", 200: "#d6bf99" },
        // Paleta Doce Escuro
        'dark-chocolate': '#2b1d1d',
        'cocoa': '#3b2525',
        'bubblegum': '#e27396',
        'soft-pink': '#ffb6c1',
        'cream-text': '#fff5f7',
        'muted-pink': '#d8a7b1',
        'marshmallow': '#f5c0c0',
        'strawberry': '#ff85a2',
        'brown-pastel': '#d4b5a0',
      },
      fontFamily: {
        sweet: ["'Comic Neue', cursive"],
      },
    },
  },
  plugins: [],
};
