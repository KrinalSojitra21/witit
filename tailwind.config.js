/** @type {import('tailwindcss').Config} */

export const colorPalette = {
  grey: {
    // 50: "#0",
    100: "#CCCCCC",
    200: "#999999",
    300: "#808080",
    400: "#666666",
    500: "#3C3D3F",
    600: "#333436",
    700: "#2A2A2D",
    800: "#202124",
    900: "#1C1D20",
    A100: "#3E424D",
    A200: "#2C2F36",
    A400: "#2A2C32",
    A700: "#26272C",
  },
  common: {
    white: "#fff",
    black: "#000",
  },
  transparent: { main: "#00000000" },
  primary: { main: "#0677E8", light: "#3097FF", dark: "#171F29" },
  secondary: { main: "#17181B", light: "#17181bcd" },
  success: { main: "#40C34D", dark: "#1FDC1B", light: "#0EA32E" },
  error: { main: "#DD5757", dark: "#642728", light: "#A04041" },
  orange: { main: "#FFA000" },
  blue: { light: "#50D5FF", main: "#1448FF", dark: "#6597BE" },
  green: { main: "#1FA682" },
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colorPalette,
    },
    screens: {
      xs: "0px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1536px",
    },

    extend: {
      fontSize: {
        "2sm": "0.8125rem",
        "2xs": "0.7rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Poppins"],
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: true },
  important: true,
};
