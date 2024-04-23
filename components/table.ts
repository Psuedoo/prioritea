import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  td: {
    bgColor: "brand.tan",
    textAlign: "center",
  },
  tbody: {
    tr: {
      "&:not(:last-child)": {
        borderBottom: "1px solid",
        borderColor: "brand.brown",
      },
    },
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
