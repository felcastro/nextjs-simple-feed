import { Avatar, Box, Text } from "@chakra-ui/react";

import { FlexArea } from "../FlexArea";
import { useAuth } from "../../context";
import { CreatePostForm } from "../CreatePostForm";
import { NextLink } from "../NextLink";

export const CreatePostBlock = () => {
  const { user } = useAuth();

  return (
    <FlexArea p={2} display={{ base: "none", sm: "flex" }}>
      {user ? (
        <>
          <Box mr={2}>
            <Avatar />
          </Box>
          <CreatePostForm flex={1} />
        </>
      ) : (
        <Box>
          <Text as="span">
            Please <NextLink href="/signin">sign in</NextLink> to post.
          </Text>
        </Box>
      )}
    </FlexArea>
  );
};
