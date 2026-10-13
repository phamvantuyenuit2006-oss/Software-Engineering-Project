/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4fd",
          100: "#dbe5fa",
          500: "#1d4ed8",
          600: "#002060",
          700: "#0f2b5c",
        },
        vietai: {
          primary: "#002060",
          accent: "#2563eb",
          gold: "#f59e0b",
          surface: "#ffffff",
          subtle: "#f8fafc"
        }
      }
    },
  },
  plugins: [],
};
