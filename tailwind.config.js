/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // GitHub color palette
        "github-gray": "#24292e",
        "github-blue": "#0366d6",
        "github-green": "#2cbe4e",
        "github-red": "#cb2431",
        "github-yellow": "#dbab09",
        "github-purple": "#6f42c1",
        "github-orange": "#f66a0a",
        "github-bg": "#f6f8fa",
        "github-border": "#e1e4e8",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Noto Sans",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
        mono: [
          "SFMono-Regular",
          "Consolas",
          "Liberation Mono",
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
