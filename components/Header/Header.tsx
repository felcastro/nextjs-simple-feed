import { Box, Flex, Textarea, Avatar } from "@chakra-ui/react";

export const Header = (props) => {
  return (
    <Flex
      as="header"
      position="sticky"
      top={0}
      p={2}
      border="1px"
      borderColor="gray.200"
      zIndex="sticky"
      bg="white"
      {...props}
    >
      <Box mr={2}>
        <Avatar />
      </Box>
      <Box flex={1}>
        <Textarea placeholder="Post something!"/>
      </Box>
    </Flex>
  );
};
