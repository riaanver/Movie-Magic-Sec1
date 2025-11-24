import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Cousine", "monospace"],
        display: ["var(--font-display)", "Cousine", "monospace"]
      },
      colors: {
        brand: {
          background: "#050915",
          surface: "rgba(13, 22, 41, 0.8)",
          border: "rgba(92, 225, 230, 0.2)",
          accent: "#5CE1E6",
          highlight: "#A855F7"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(92, 225, 230, 0.35)",
        card: "0 20px 50px rgba(5, 9, 21, 0.35)"
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.4 },
          "50%": { opacity: 0.9 }
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" }
        }
      },
      animation: {
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
