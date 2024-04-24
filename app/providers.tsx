// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { tableTheme } from "../components/table";

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
