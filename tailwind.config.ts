import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
      backgroundImage: {
        'hero-background': 'linear-gradient(to right, #040D157F, #0F0F1D72),url("./public/image/hero-image.jpg")',
      }
    },
  },
  darkMode: "selector",
  plugins: [],
};
export default config;
