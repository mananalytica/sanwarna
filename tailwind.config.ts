import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        mist: "#F5F5F7",
        cloud: "#FBFBFD",
        hairline: "#D2D2D7",
        graphite: "#1D1D1F",
        steel: "#6E6E73",
        champagne: "#B8874E",
        "champagne-light": "#D9AE72",
        "champagne-soft": "#C9A56A",
        brass: "#8B7355",
        rust: "#B3492E",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.18em",
      },
      maxWidth: {
        prose2: "68ch",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(184,135,78,0.35)",
        lift: "0 20px 45px -18px rgba(29,29,31,0.18)",
        card: "0 1px 2px rgba(29,29,31,0.04), 0 8px 24px -12px rgba(29,29,31,0.10)",
      },
      backgroundImage: {
        "gold-line": "linear-gradient(90deg, transparent, #B8874E, transparent)",
        "vignette": "radial-gradient(120% 120% at 50% 0%, rgba(184,135,78,0.07), rgba(184,135,78,0) 60%)",
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        reveal: "reveal 0.9s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
