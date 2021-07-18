import { Box, Flex, Avatar, Stack, Text, FlexProps } from "@chakra-ui/react";
import { format } from "date-fns";

export interface PostProps extends FlexProps {
  avatarUrl: string;
  creatorUsername: string;
  createdAt: Date;
  content: string;
}

export const Post = ({
  avatarUrl,
  creatorUsername,
  createdAt,
  content,
  ...props
}: PostProps) => (
  <Flex
    py={2}
    px={2}
    shadow="sm"
    borderRadius="md"
    border="1px"
    borderColor="gray.200"
    {...props}
  >
    <Box mr={2}>
      <Avatar src={avatarUrl} />
    </Box>
    <Stack flex={1}>
      <Stack spacing={0}>
        <Text as="span" lineHeight="shorter">
          {creatorUsername}
        </Text>
        <Text as="span" fontSize="sm" color="gray.600" lineHeight="shorter">
          {format(createdAt, "yyyy-MM-dd HH:mm")}
        </Text>
      </Stack>
      <Box>{content}</Box>
    </Stack>
  </Flex>
);
