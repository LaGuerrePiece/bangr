/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#EFEEEC",
          dark: "#1E2124",
        },
        secondary: {
          light: "#FFFFFF",
          dark: "#282B30",
        },
        typo: {
          light: "#000000",
          dark: "#D1D1D1",
        },
        typo2: {
          light: "#959088",
          dark: "#959088",
        },
        btn: {
          light: "#254976",
          dark: "#3A5A83",
        },
        lightBlue: {
          light: "#ECF4FE",
          dark: "#3A5A83",
        },
      },
    },
  },
  plugins: [],
};
