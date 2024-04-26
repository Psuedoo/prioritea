"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { tableTheme } from "../components/table";

// This is the color scheme I have been using:
// https://coolors.co/ccd5ae-e9edc9-fefae0-faedcd-d4a373
const theme = extendTheme({
  colors: {
    brand: {
      lightTan: "#FEFAE0",
      tan: "#FAEDCD",
      lightGreen: "#E9EDC9",
      green: "#CCD5AE",
      brown: "#D4A373",
      darkBrown: "#7C4A1B",
    },
  },
  components: {
    Table: tableTheme,
    Button: {
      variants: {
        solid: {
          bgColor: "brand.white",
          _hover: {
            bgColor: "brand.lightGreen",
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bgGradient: "radial(brand.lightGreen, brand.green)",
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
