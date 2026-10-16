import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0EA5E9",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          DEFAULT: "#14B8A6",
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          900: "#134e4a",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          50: "#f5f3ff",
          500: "#8b5cf6",
          900: "#4c1d95",
        },
        success: {
          DEFAULT: "#10B981",
          50: "#ecfdf5",
          500: "#10b981",
          900: "#064e3b",
        },
        warning: {
          DEFAULT: "#F59E0B",
          50: "#fffbeb",
          500: "#f59e0b",
          900: "#78350f",
        },
        danger: {
          DEFAULT: "#EF4444",
          50: "#fef2f2",
          500: "#ef4444",
          900: "#7f1d1d",
        },
        info: {
          DEFAULT: "#3B82F6",
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px rgba(0, 0, 0, 0.08)",
        dropdown: "0 10px 40px rgba(0, 0, 0, 0.1)",
        modal: "0 20px 60px rgba(0, 0, 0, 0.15)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.4s ease-out",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
