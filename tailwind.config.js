/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily:{
        rajdhaniBold: ["var(--font-rajdhani-bold)"],
        rajdhaniLight: ["var(--font-rajdhani-light)"],
        rajdhaniMedium: ["var(--font-rajdhani-medium)"],
        rajdhaniRegular: ["var(--font-rajdhani-regular)"],
        rajdhaniSemiBold: ["var(--font-rajdhani-semi-bold)"]
      },
    },
  },
  plugins: [],
};
