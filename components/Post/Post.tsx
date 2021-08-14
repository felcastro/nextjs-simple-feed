import {
  Box,
  Avatar,
  Stack,
  Text,
  FlexProps,
  Flex,
  useBoolean,
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { formatDistance, parseISO } from "date-fns";
import React, { useState } from "react";
import {
  FaComment,
  FaEllipsisV,
  FaFlag,
  FaHeart,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { useAuth } from "../../context";
import { supabase } from "../../supabaseApi";
import { CreatePostForm } from "../CreatePostForm";
import { FlexArea } from "../FlexArea";
import { LinkRoleBox } from "../LinkRoleBox";
import { NextLink } from "../NextLink";

interface PostActionsProps {
  isOwner: boolean;
  displayActions: boolean;
  deleteAction: () => void;
}

const PostActions = ({ isOwner, deleteAction }: PostActionsProps) => {
  return (
    <Menu placement="left-start">
      <MenuButton
        as={IconButton}
        icon={<FaEllipsisV />}
        aria-label="Post actions"
        variant="ghost"
        display="inline-flex"
        alignItems="center"
        colorScheme="brand"
        onClick={(e) => e.stopPropagation()}
      />
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

const SignInWarn = () => (
  <Box>
    <Text as="span">
      Please{" "}
      <NextLink href="/signin" onClick={(e) => e.stopPropagation()}>
        sign in
      </NextLink>{" "}
      to reply.
    </Text>
  </Box>
);

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postParentUuid?: string;
}

const PostReplyModal = ({
  isOpen,
  onClose,
  postParentUuid,
}: CreatePostModalProps) => {
  const { user } = useAuth();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Reply</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {user ? (
            <CreatePostForm
              postParentUuid={postParentUuid}
              onSuccess={onClose}
            />
          ) : (
            <SignInWarn />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
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
  fontColor?: string;
  backgroundColor?: string;
  createdAt: string;
}

export const Post = ({
  uuid,
  ownerUuid,
  parentUuid,
  avatarUrl,
  creatorUsername,
  createdAt,
  content,
  commentsCount,
  fontColor,
  backgroundColor,
  ...props
}: PostProps) => {
  const { user } = useAuth();
  const toast = useToast();
  const [displayActions, setDisplayActions] = useBoolean(false);
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
    <LinkRoleBox href={`/posts/${uuid}`}>
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
        _hover={{ bg: "whiteAlpha.400" }}
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
              <Box>
                <NextLink
                  href={`/posts/${uuid}`}
                  fontSize="xs"
                  color={fontColor ? fontColor : "gray.600"}
                  lineHeight="shorter"
                  isTruncated
                >
                  {formatDistance(parseISO(createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </NextLink>
              </Box>
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
          <Divider />
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
          <PostReplyModal
            isOpen={isOpen}
            onClose={onClose}
            postParentUuid={uuid}
          />
        </Stack>
      </FlexArea>
    </LinkRoleBox>
  );
};
