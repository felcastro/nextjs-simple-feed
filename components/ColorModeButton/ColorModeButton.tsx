import { IconButton, useColorMode, IconButtonProps } from "@chakra-ui/react";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export const ColorModeButton = (props: Omit<IconButtonProps, "aria-label">) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
      aria-label="Toggle Color Mode"
      onClick={toggleColorMode}
      variant="ghost"
      colorScheme="brand"
      {...props}
    />
  );
};
