// cspell:disable
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: { 50: "#ffe6f0", 100: "#ffcce0", 200: "#ff99c2", 300: "#ff66a3" },
        brown: { 50: "#f5efe6", 100: "#eadfcc", 200: "#d6bf99" },
      },
      fontFamily: {
        sweet: ["'Comic Neue', cursive"],
      },
    },
  },
  plugins: [],
};
