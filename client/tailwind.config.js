/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "base-100": "rgba(14, 70, 163, 1)",
        "base-200": "rgba(18, 165, 188, 1)",
        "base-300": "rgba(50, 50, 50, 1)",
        "secondary-100": "rgba(50, 50, 50, 1)",
        "secondary-100-75": "rgba(50, 50, 50, 0.75)",
        "secondary-200": "rgba(205, 205, 205, 1)",
        "secondary-200-60": "rgba(205, 205, 205, 0.6)",
        "secondary-300": "rgba(253, 255, 255, 1)",
        "secondary-400": "rgba(244, 245, 247, 1)",
        "accent-100": "rgba(239, 68, 68, 1)",
        "accent-200": "rgba(254, 226, 226, 1)",
      },
    },
  },
  plugins: [],
};
