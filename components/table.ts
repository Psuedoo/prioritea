import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  tbody: {
    tr: {
      bgColor: "brand.tan",
      _even: {
        bgColor: "brand.lightTan",
      },
      _hover: {
        bgColor: "brand.lightGreen",
      },
      "&:not(:last-child)": {
        borderBottom: "1px solid",
        borderColor: "brand.brown",
      },
    },
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
