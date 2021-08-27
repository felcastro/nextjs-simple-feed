export const theme = {
  styles: {
    global: ({ colorMode }) => ({
      body: {
        bg: colorMode === "light" ? "gray.50" : "black",
      },
    }),
  },
  colors: {
    brand: {
      50: "#defff5",
      100: "#b4fae3",
      200: "#88f5d1",
      300: "#5bf1bf",
      400: "#31edad",
      500: "#1bd393",
      600: "#0ea473",
      700: "#037552",
      800: "#004730",
      900: "#00190e",
    },
  },
};
