import { IconButton, IconButtonProps } from "@chakra-ui/react";
import React from "react";

export const FloatingButton = (props: IconButtonProps) => (
  <IconButton
    position="fixed"
    bottom={4}
    right={4}
    width={16}
    height={16}
    fontSize="2xl"
    colorScheme="brand"
    isRound
    shadow="md"
    display={{ base: "inline-flex", sm: "none" }}
    {...props}
  />
);
