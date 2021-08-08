import {
  Box,
  Avatar,
  Stack,
  Text,
  FlexProps,
  Flex,
  Icon,
  useBoolean,
  useBreakpoint,
  IconButton,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  HStack,
  Tooltip,
  useBreakpointValue,
  Grid,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { FaEllipsisV, FaFlag, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context";
import { supabase } from "../../supabaseApi";
import { FlexArea } from "../FlexArea";

interface PostActionsProps {
  isOwner: boolean;
  displayActions: boolean;
  deleteAction: () => void;
}

const PostActions = ({
  isOwner,
  displayActions,
  deleteAction,
}: PostActionsProps) => {
  const breakpoint = useBreakpoint();

  return breakpoint === "base" ? (
    <Menu placement="left-start">
      <MenuButton
        as={IconButton}
        icon={<FaEllipsisV />}
        aria-label="Post actions"
        variant="unstyled"
        display="inline-flex"
        alignItems="center"
        h={{ base: "100%", sm: "inherit" }}
      />
      <MenuList minW="unset" color="ButtonText">
        {isOwner && (
          <MenuItem icon={<FaTrash />} color="red.500" onClick={deleteAction}>
            Delete
          </MenuItem>
        )}
        {!isOwner && (
          <MenuItem icon={<FaFlag />} isDisabled={true}>
            Report
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  ) : displayActions ? (
    <HStack color="ButtonText">
      {isOwner && (
        <Tooltip label="Delete post">
          <IconButton
            icon={<FaTrash />}
            aria-label="Delete post"
            size="sm"
            color="red.500"
            onClick={deleteAction}
          />
        </Tooltip>
      )}
      {!isOwner && (
        <Tooltip label="Report post">
          <IconButton
            icon={<FaFlag />}
            aria-label="Delete post"
            size="sm"
            isDisabled
          />
        </Tooltip>
      )}
    </HStack>
  ) : (
    <Icon as={FaEllipsisV} />
  );
};

export interface PostProps extends FlexProps {
  uuid: string;
  ownerUuid: string;
  avatarUrl: string;
  creatorUsername: string;
  content: string;
  fontColor?: string;
  backgroundColor?: string;
  createdAt: string;
}

export const Post = ({
  uuid,
  ownerUuid,
  avatarUrl,
  creatorUsername,
  createdAt,
  content,
  fontColor,
  backgroundColor,
  ...props
}: PostProps) => {
  const { user } = useAuth();
  const [displayActions, setDisplayActions] = useBoolean(false);

  async function deletePost(uuid: string) {
    await supabase.from("posts").delete().match({ uuid });
  }

  return (
    <FlexArea
      py={2}
      px={2}
      borderRadius="md"
      borderColor={fontColor ? fontColor : "gray.200"}
      color={fontColor ? fontColor : "inherit"}
      bg={backgroundColor ? backgroundColor : "white"}
      {...props}
      onMouseEnter={setDisplayActions.on}
      onMouseLeave={setDisplayActions.off}
    >
      <Box mr={2}>
        <Avatar
          src={avatarUrl}
          size={useBreakpointValue({ base: "sm", sm: "md" })}
        />
      </Box>
      <Stack flex={1}>
        <Flex justifyContent="space-between" align="center">
          <Grid>
            <Text
              as="span"
              lineHeight="shorter"
              fontSize={{ base: "sm", sm: "md" }}
              isTruncated
            >
              {creatorUsername}
            </Text>
            <Text
              as="span"
              fontSize={{ base: "xs", sm: "sm" }}
              color={fontColor ? fontColor : "gray.600"}
              lineHeight="shorter"
            >
              {format(parseISO(createdAt), "yyyy-MM-dd HH:mm")}
            </Text>
          </Grid>
          <PostActions
            isOwner={user?.id === ownerUuid}
            displayActions={displayActions}
            deleteAction={() => deletePost(uuid)}
          />
        </Flex>
        <Box wordBreak="break-word" whiteSpace="pre-wrap">
          {content}
        </Box>
      </Stack>
    </FlexArea>
  );
};
