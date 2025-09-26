/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1280px",
      xl: "1920px",
    },
    container: {
      padding: {
        DEFAULT: "10px",
        xl: "70px",
        lg: "40px",
        md: "16px",
      },
      center: true,
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.06), 0 1px 3px 0 rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
