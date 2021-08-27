import { Flex, FlexProps, useColorModeValue } from "@chakra-ui/react";

export const BaseBlock = (props: FlexProps) => (
  <Flex
    border="1px"
    borderColor={useColorModeValue("gray.200", "whiteAlpha.300")}
    bg={useColorModeValue("white", "gray.900")}
    shadow="sm"
    {...props}
  />
);
