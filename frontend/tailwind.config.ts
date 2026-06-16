import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F4F0FF",
        ink: "#2B2147",
        muted: "#7A6FA0",
        primary: "#7C5CFF",
        "primary-dark": "#5B3FE0",
        pink: "#FF6B9D",
        "pink-dark": "#E03B87", // ✅ Ajouté pour corriger définitivement l'erreur
        mint: "#34D399",
        sun: "#FFC93C",
        sky: "#4CC9F0",
        coral: "#FF6B6B",
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "system-ui", "sans-serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      boxShadow: {
        pop: "4px 4px 0 0 #2B2147",
        "pop-lg": "6px 6px 0 0 #2B2147",
        "pop-sm": "3px 3px 0 0 #2B2147",
        soft: "0 10px 30px -10px rgba(124,92,255,0.35)",
      },
      keyframes: {
        "bounce-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "bounce-in": "bounce-in 0.4s ease-out",
        wiggle: "wiggle 0.6s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
