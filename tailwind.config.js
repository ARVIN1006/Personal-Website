/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
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
      container: {
        center: true,
        padding: "2rem",
        screens: { xl: "1400px" },
      },
    },
  },
  plugins: [],
};
