/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marble & bronze palette: cool Carrara-marble white for backgrounds,
        // a dark warm charcoal (veined marble in shadow) for structure/text,
        // and statuary bronze/copper for calls-to-action and accents —
        // evokes the Basilica's marble floors and columns plus its bronze
        // horses, rather than a literal gold-and-navy re-skin.
        basilica: {
          marble: "#f1efe9",
          marbleDark: "#3a352f",
          marbleBlack: "#211d19",
          bronze: "#9c6b3e",
          bronzeDark: "#7a4f2a",
          copper: "#c98a52",
          slate: "#6b7280",
          oxide: "#7a3b2e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
