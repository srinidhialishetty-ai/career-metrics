/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050816",
        night: "#0a1020",
        aurora: "#7c5cff",
        cyan: "#45d0ff",
        mist: "#a7b6d7",
      },
      fontFamily: {
        sans: ["'Sora'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(122, 92, 255, 0.25), 0 24px 80px rgba(69, 208, 255, 0.18)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(124, 92, 255, 0.28), transparent 35%), radial-gradient(circle at 80% 20%, rgba(69, 208, 255, 0.18), transparent 30%), linear-gradient(180deg, rgba(10, 16, 32, 0.85), rgba(5, 8, 22, 1))",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(124, 92, 255, 0.35)" },
          "50%": { boxShadow: "0 0 0 12px rgba(124, 92, 255, 0)" },
        },
        drift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(18px, -12px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        sweep: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite",
        drift: "drift 10s ease-in-out infinite",
        sweep: "sweep 12s ease infinite",
        rise: "rise 0.7s ease-out forwards",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
