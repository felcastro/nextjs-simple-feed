import {
  Box,
  Avatar,
  Text,
  FlexProps,
  Flex,
  IconButton,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Tooltip,
  useBreakpointValue,
  Grid,
  Divider,
  Button,
  ButtonProps,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { parseISO } from "date-fns";
import React, { useState } from "react";
import {
  FaComment,
  FaEllipsisH,
  FaFlag,
  FaHeart,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../../context";
import { supabase } from "../../supabaseApi";
import { BaseBlock } from "../BaseBlock";
import { NextLink } from "../NextLink";
import { formatDistanceAbr } from "../../utils/formatDistanceAbr";
import { CreatePostModal } from "../CreatePostModal";

interface PostActionsProps {
  isOwner: boolean;
  deleteAction: () => void;
}

const PostActionsMenu = ({ isOwner, deleteAction }: PostActionsProps) => {
  return (
    <Menu placement="left-start">
      <Tooltip label="Menu" aria-label="Menu">
        <MenuButton
          as={IconButton}
          icon={<FaEllipsisH />}
          aria-label="Post actions"
          variant="ghost"
          display="inline-flex"
          alignItems="center"
          size="xs"
          colorScheme="brand"
          onClick={(e) => e.stopPropagation()}
        />
      </Tooltip>
      <MenuList minW="unset" color="ButtonText">
        {isOwner && (
          <MenuItem
            icon={<FaTrash />}
            color="red.500"
            onClick={(e) => {
              e.stopPropagation();
              deleteAction();
            }}
          >
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
  );
};

interface PostInteractionButtonProps extends ButtonProps {
  label?: string;
  value?: string | number;
}

const PostInteractionButton = ({
  label,
  leftIcon,
  value,
  ...props
}: PostInteractionButtonProps) => {
  return (
    <Tooltip label={label} aria-label={label}>
      <Button
        leftIcon={leftIcon}
        h="auto"
        py={1}
        px={2}
        colorScheme="brand"
        variant="ghost"
        borderRadius="lg"
        {...props}
      >
        {value}
      </Button>
    </Tooltip>
  );
};

export interface PostProps extends FlexProps {
  uuid: string;
  ownerUuid: string;
  parentUuid?: string;
  avatarUrl: string;
  creatorUsername: string;
  content: string;
  commentsCount: number;
  createdAt: string;
}

export const Post = ({
  uuid,
  ownerUuid,
  avatarUrl,
  creatorUsername,
  createdAt,
  content,
  commentsCount,
  ...props
}: PostProps) => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLiked, setIsLiked] = useState(false);

  async function deletePost(uuid: string) {
    const { error } = await supabase.from("posts").delete().match({ uuid });

    if (error) {
      toast({
        isClosable: true,
        position: "top-right",
        title: `Error deleting post`,
        description: error.message,
        status: "error",
      });
    }
  }

  async function toggleLikePost() {
    setIsLiked(!isLiked);
  }

  return (
    <BaseBlock
      p={2}
      borderRadius="md"
      borderColor={useColorModeValue("gray.200", "whiteAlpha.300")}
      bg={useColorModeValue("white", "gray.900")}
      _hover={{
        bg: useColorModeValue("whiteAlpha.400", "gray.800"),
        transition: "background-color .2s linear",
      }}
      {...props}
    >
      <Box mr={2}>
        <Avatar
          src={avatarUrl}
          size={useBreakpointValue({ base: "sm", sm: "md" })}
        />
      </Box>
      <Box flex={1}>
        <Flex justifyContent="space-between" align="center">
          <Grid
            templateColumns="auto auto auto"
            display="inline-grid"
            alignItems="center"
            fontSize={{ base: "sm", sm: "md" }}
          >
            <Text as="span" whiteSpace="nowrap" overflow="hidden">
              {creatorUsername}
            </Text>
            <Text
              as="span"
              mx={1}
              color={useColorModeValue("gray.600", "whiteAlpha.600")}
            >
              ·
            </Text>
            <NextLink
              href={`/posts/${uuid}`}
              color={useColorModeValue("gray.600", "whiteAlpha.600")}
            >
              {formatDistanceAbr(parseISO(createdAt), new Date())}
            </NextLink>
          </Grid>
          <PostActionsMenu
            isOwner={user?.id === ownerUuid}
            deleteAction={() => deletePost(uuid)}
          />
        </Flex>
        <Box wordBreak="break-word" whiteSpace="pre-wrap">
          {content}
        </Box>
        <Divider my={2} />
        <Flex>
          <PostInteractionButton
            label="Reply"
            leftIcon={<FaComment />}
            value={commentsCount}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          />
          <PostInteractionButton
            label="Like"
            leftIcon={isLiked ? <FaHeart /> : <FaRegHeart />}
            value={0}
            onClick={toggleLikePost}
            isDisabled={true}
          />
        </Flex>
        <CreatePostModal
          isOpen={isOpen}
          onClose={onClose}
          postParentUuid={uuid}
          isReply
        />
      </Box>
    </BaseBlock>
  );
};
