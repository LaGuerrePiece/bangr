/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter"],
        InterMedium: ["InterMedium"],
        InterSemiBold: ["InterSemiBold"],
        InterBold: ["InterBold"],
        InterExtraBold: ["InterExtraBold"],
        InterBlack: ["InterBlack"],
      },
      colors: {
        primary: {
          light: "#F8F8F8",
          dark: "#1B1C1E",
        },
        secondary: {
          light: "#FFFFFF",
          dark: "#282B30",
        },
        tertiary: {
          light: "#FFFFFF",
          dark: "#3c414a",
        },
        quaternary: {
          light: "#FFFFFF",
          dark: "#43464D",
        },
        special: {
          light: "#1E1E1E",
          dark: "#F3F0ED",
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
          light: "#000000",
          dark: "#FFFFFF",
        },
        lightBlue: {
          light: "#ECF4FE",
          dark: "#3A5A83",
        },
        icon : {
          light: "#595654",
          dark: "#BFB7B0",
          special  : "#282828"
        }
      },
    },
  },
  plugins: [],
};
