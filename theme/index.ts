import { Color, createTheme } from "@mui/material";

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
  primary: { main: "#0677E8", light: "#3097FF", dark: "#171F29" },
  secondary: { main: "#17181B", light: "#17181bcd" },
  success: { main: "#40C34D", dark: "#1FDC1B", light: "#0EA32E" },
  error: { main: "#DD5757", dark: "#642728", light: "#A04041" },
  orange: { main: "#FFA000" },
  blue: { light: "#50D5FF", main: "#1448FF", dark: "#6597BE" },
  green: { main: "#1FA682" },
};

export const theme = createTheme({
  palette: { ...colorPalette },
  typography: {
    fontFamily: [
      "Poppins",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    button: {
      fontSize: 16,
      fontWeight: 500,
      textTransform: "none",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
});
// Typescript module augmentation
import "@mui/material";
declare module "@mui/material/styles" {
  interface Palette {
    orange: Palette["primary"];
    blue: Palette["primary"];
    green: Palette["primary"];
  }
  interface PaletteOptions {
    orange?: PaletteOptions["primary"];
    blue?: PaletteOptions["primary"];
    green?: PaletteOptions["primary"];
  }
  interface BreakpointOverrides {
    // xxs: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}
