/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  container: {
    center: true,
    padding: {
      DEFAULT: "1rem",
      sm: "2rem",
      lg: "4rem",
      xl: "5rem",
      "2xl": "6rem",
    },
  },
  extend: {
    colors: {
      studio: {
        black: "#050505",
        soft: "#0a0a0a",
        white: "#ededed",
        gray: "#888888",
        accent: "#3b82f6",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Playfair Display", "serif"],
    },
  },
  plugins: [],
};
