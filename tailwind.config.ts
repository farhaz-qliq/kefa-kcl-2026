import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-lime": "#C7FF00",
        "electric-cyan": "#00D9FF",
        navy: "#0B1220",
        "navy-800": "#131c2e",
        "navy-700": "#1a2540",
        "navy-600": "#243050",
        surface: "#F4F6FA",
        "surface-2": "#E8ECF4",
      },
      fontFamily: {
        heading: ["var(--font-anton)", "Impact", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      maxWidth: {
        shell: "480px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
