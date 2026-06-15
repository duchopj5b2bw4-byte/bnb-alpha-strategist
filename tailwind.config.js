/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59,130,246,0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(59,130,246,0.8)" },
        },
      },
    },
  },
  plugins: [],
};
