import { Flex, FlexProps } from "@chakra-ui/react";

export const FlexArea = (props: FlexProps) => (
  <Flex border="1px" borderColor="gray.200" bg="white" shadow="sm" {...props} />
);
