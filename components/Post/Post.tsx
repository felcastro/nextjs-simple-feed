import { Box, Flex, Avatar, Stack, Text, FlexProps } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";

export interface PostProps extends FlexProps {
  avatarUrl: string;
  creatorUsername: string;
  content: string;
  fontColor?: string;
  backgroundColor?: string;
  createdAt: string;
}

export const Post = ({
  avatarUrl,
  creatorUsername,
  createdAt,
  content,
  fontColor,
  backgroundColor,
  ...props
}: PostProps) => (
  <Flex
    py={2}
    px={2}
    shadow="sm"
    borderRadius="md"
    border="1px"
    borderColor={fontColor ? fontColor : "gray.200"}
    color={fontColor}
    bg={backgroundColor}
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
        <Text
          as="span"
          fontSize="sm"
          color={fontColor ? fontColor : "gray.600"}
          lineHeight="shorter"
        >
          {format(parseISO(createdAt), "yyyy-MM-dd HH:mm")}
        </Text>
      </Stack>
      <Box>{content}</Box>
    </Stack>
  </Flex>
);
