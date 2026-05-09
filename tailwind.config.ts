import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          50: "#faf9f7",
          100: "#f3f1ed",
          200: "#e8e4dd",
          300: "#d5cfc4",
          400: "#b8b0a0",
          500: "#9a8f7d",
          600: "#7d7264",
          700: "#5e5548",
          800: "#3d3730",
          900: "#1e1b17",
          950: "#0f0e0c",
        },
        accent: {
          DEFAULT: "#e85d3a",
          light: "#f07d5e",
          dark: "#c94a2a",
          glow: "rgba(232, 93, 58, 0.3)",
        },
        mint: {
          DEFAULT: "#4ecdc4",
          light: "#7eddd6",
          dark: "#3ab5ad",
        },
      },
      fontFamily: {
        display: ['"Space Mono"', "monospace"],
        body: ['"DM Sans"', "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(232, 93, 58, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(232, 93, 58, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
