import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0A1711",
          900: "#10261C", // Deep Forest Green (Primary)
          850: "#143024",
          800: "#1D4635", // Rich Botanical Emerald (Secondary)
          700: "#275945",
          600: "#367B5F",
          500: "#499E7D",
        },
        charcoal: {
          950: "#090B0A",
          900: "#111513", // Deep Charcoal
          800: "#1E2421",
          700: "#2F3834",
          600: "#4A544F",
          500: "#6B7771",
        },
        ivory: {
          50: "#FCFAF6",
          100: "#F7F3EA", // Warm Ivory (Background)
          200: "#EFE8DA",
          300: "#E8DFD0", // Soft Natural Beige
          400: "#D6CABA",
        },
        gold: {
          300: "#E5D2A5",
          400: "#D6BE84",
          500: "#C9A96A", // Muted Champagne Gold (Accent)
          600: "#B38F4E",
          700: "#917036",
        },
        sage: {
          100: "#E8ECE8",
          200: "#D1DCD1",
          300: "#B2C3B2",
          400: "#879B87", // Muted Sage
          500: "#6B816B",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(16, 38, 28, 0.08)",
        "luxury-lg": "0 20px 40px -15px rgba(16, 38, 28, 0.12)",
        "gold-glow": "0 0 25px rgba(201, 169, 106, 0.25)",
      },
      borderRadius: {
        luxury: "2px",
      },
      animation: {
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
        "marquee": "marquee 35s linear infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1.5deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
