import {
  Avatar,
  Box,
  Button,
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
  Stack,
  StackProps,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FormEvent } from "react";
import { useState } from "react";
import { FaEdit, FaPalette } from "react-icons/fa";
import { Post } from "../components/Post";

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
            colorScheme="blue"
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

  const posts = [
    {
      id: "1",
      avatarUrl: "",
      creatorUsername: "John Doe",
      createdAt: new Date(),
      content: "This is the post content.",
    },
  ];

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
        {posts.map((p) => (
          <Post
            key={p.id}
            avatarUrl={p.avatarUrl}
            creatorUsername={p.creatorUsername}
            createdAt={p.createdAt}
            content={p.content}
          />
        ))}
      </Stack>
      <FloatingPostButton onOpen={onOpen} />
    </Box>
  );
}
