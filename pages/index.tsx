import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  StackProps,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { FormEvent } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaEdit, FaPalette } from "react-icons/fa";
import { supabase } from "../api";
import { Post } from "../components/Post";
import { feedService } from "../services";
import { FeedPostI } from "../services/feed.service";

interface FloatingPostButtonProps {
  onOpen: () => void;
}

const FloatingPostButton = ({ onOpen }: FloatingPostButtonProps) => (
  <IconButton
    icon={<FaEdit />}
    aria-label="New post"
    position="absolute"
    bottom={4}
    right={4}
    width={16}
    height={16}
    fontSize="2xl"
    colorScheme="brand"
    isRound
    shadow="md"
    display={{ base: "inline-flex", sm: "none" }}
    onClick={onOpen}
  />
);

const CreatePostForm = ({ ...props }: StackProps) => {
  const [postContent, setPostContent] = useState<string>("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <Stack as="form" {...props} onSubmit={onSubmit}>
      <FormControl id="post">
        <Textarea
          placeholder="Post something!"
          onChange={(e) => setPostContent(e.target.value)}
          maxLength={500}
          maxH="xs"
        />
        <FormHelperText>
          {500 - postContent.length} characters left
        </FormHelperText>
      </FormControl>
      <Flex align="center">
        <Flex flex={1}>
          <IconButton
            icon={<FaPalette />}
            aria-label="Select Color"
            isRound
            colorScheme="brand"
            variant="outline"
          />
        </Flex>
        <Button type="submit" colorScheme="brand" size="sm">
          Send
        </Button>
      </Flex>
    </Stack>
  );
};

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>New Post</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <CreatePostForm />
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<FeedPostI[]>([]);
  const toast = useToast();

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        const data = await feedService.getFeed();

        if (data) {
          setPosts(data);
        }
      } catch (err) {
        toast({
          title: "Error loading posts.",
          description: "An error has ocurred while loading the feed posts.",
          status: "error",
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, [toast]);

  useEffect(() => {
    const subscription = supabase
      .from<FeedPostI>("feed")
      .on("INSERT", (post) => {
        setPosts((p) => [post.new, ...p]);
      })
      .on("DELETE", (post) => {
        setPosts((p) => p.filter((p) => p.uuid !== post.new.uuid));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Box>
      <CreatePostModal isOpen={isOpen} onClose={onClose} />
      <Flex
        p={2}
        border="1px"
        borderColor="gray.200"
        bg="white"
        shadow="sm"
        display={{ base: "none", sm: "flex" }}
      >
        <Box mr={2}>
          <Avatar />
        </Box>
        <CreatePostForm flex={1} />
      </Flex>
      <Divider my={2} display={{ base: "none", sm: "block" }} />
      <Stack spacing={2}>
        {isLoading ? (
          <Center p={4}>
            <Spinner color="brand.500" />
          </Center>
        ) : (
          posts.map((p) => (
            <Post
              key={p.uuid}
              avatarUrl={p.owner_avatar_url}
              creatorUsername={p.owner_username}
              createdAt={p.created_at}
              content={p.content}
              fontColor={p.font_color}
              backgroundColor={p.background_color}
            />
          ))
        )}
      </Stack>
      <FloatingPostButton onOpen={onOpen} />
    </Box>
  );
}
