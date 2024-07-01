import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#F0B1CC",
        primaryLight: "#fcf3f7",
        secondary: "#D3686C",
        primaryDark: "#540002",
        fontColor: "#333333",
        redAtention: "#EB312C",
        darkBackground: "#1a1a1a",
        darkPrimary: "#a63955",
        darkSecondary: "#7c3d3d",
        darkFontColor: "#e4e4e4",
      },
      backgroundImage: {
        "header-bg": "url('/images/banner6.svg')",
        "header-bg-dark": "url('/images/banner6dark.svg')",
        "dark-secondary-gradient": "linear-gradient(45deg, #7c3d3d, #4b2c2c)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
