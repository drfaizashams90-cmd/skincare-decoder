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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#f5f0fa",
          100: "#e6d6f5",
          200: "#c9a3eb",
          300: "#a56fe0",
          400: "#8340d6",
          500: "#6b1fc7",
          600: "#5416a3",
          700: "#3d0f7a",
          800: "#260a4d",
          900: "#120018",
        },
      },
      fontFamily: {
        heading: ["var(--font-gruppo)", "sans-serif"],
        body: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
