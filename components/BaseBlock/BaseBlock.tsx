import { Flex, FlexProps } from "@chakra-ui/react";

export const BaseBlock = (props: FlexProps) => (
  <Flex border="1px" borderColor="gray.200" bg="white" shadow="sm" {...props} />
);
