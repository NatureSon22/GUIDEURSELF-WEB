/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
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
        "secondary-350": "rgb(241, 241, 241)",
        "secondary-400": "rgba(244, 245, 247, 1)",
        "accent-100": "rgba(239, 68, 68, 1)",
        "accent-200": "rgba(254, 226, 226, 1)",
        "accent-300": "rgba(34, 197, 94, 1)",
        "accent-400": "rgba(220, 252, 231, 1)",
        "accent-500": "rgb(254, 226, 226, 1)",
        "accent-600": "rgba(249, 180, 0, 1)",
        "accent-700": "rgba(254, 243, 199, 1)",
        "chart-100": "rgba(14, 70, 163, 1)",
        "chart-200": "rgba(128, 202, 238, 1)",
        "chart-300": "rgba(60, 80, 224, 1)",
        "chart-400": "rgba(18, 165, 188, 1)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {},
      boxShadow: {
        "top-only": "0 -3px 6px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-in",
        "fade-out": "fade-out 0.2s ease-out",
        "zoom-in": "zoom-in 0.2s ease-in",
        "zoom-out": "zoom-out 0.2s ease-out",
      },
    },
  },
};
