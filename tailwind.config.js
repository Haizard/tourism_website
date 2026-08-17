/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0d9488",    // Teal 600 - Great contrast on white
        secondary: "#eab308",  // Yellow 500 - Great for accents
        background: "#0f172a", // Slate 900 - Very dark, high contrast with white text
        surface: "#f8fafc",    // Slate 50 - Very light gray, distinct from pure white
        accent: "#f97316",     // Orange 500
        dark: "#1e293b",       // Slate 800
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Montserrat'", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      boxShadow: {
        "glow-primary": "0 20px 60px -15px rgba(13,148,136,0.35)",
        "glow-gold": "0 20px 60px -15px rgba(234,179,8,0.30)",
        "glow-accent": "0 20px 60px -15px rgba(249,115,22,0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "pulse-soft": "pulseSoft 1.6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(0.97)" },
        },
      },
    },
  },
  plugins: [],
};
