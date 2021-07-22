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
  HStack,
  IconButtonProps,
} from "@chakra-ui/react";
import React, { useEffect, useState, FormEvent } from "react";
import { ColorResult } from "react-color";
import { FaEdit, FaFillDrip, FaFont } from "react-icons/fa";
import { supabase } from "../api";
import { FlexArea } from "../components/FlexArea";
import { ColorPickerButton } from "../components/ColorPickerButton";
import { Header } from "../components/Header";
import { Post } from "../components/Post";
import { feedService } from "../services";
import { FeedPostI } from "../services/feed.service";

const FloatingButton = (props: IconButtonProps) => (
  <IconButton
    icon={<FaEdit />}
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
    {...props}
  />
);

const CreatePostForm = ({ ...props }: StackProps) => {
  const [postContent, setPostContent] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>();
  const [fontColor, setFontColor] = useState<string>();

  function handleBackgroundColorChange(color: ColorResult) {
    setBackgroundColor(color.hex);
  }

  function handleFontColorChange(color: ColorResult) {
    setFontColor(color.hex);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <Stack as="form" {...props} onSubmit={onSubmit}>
      <FormControl id="post">
        <Textarea
          placeholder="Post something!"
          maxLength={500}
          maxH="xs"
          bg={backgroundColor ? backgroundColor : "inherit"}
          color={fontColor ? fontColor : "inherit"}
          borderColor={fontColor ? fontColor : "inherit"}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <FormHelperText>
          {500 - postContent.length} characters left
        </FormHelperText>
      </FormControl>
      <Flex align="center">
        <HStack flex={1}>
          <ColorPickerButton
            icon={<FaFillDrip />}
            aria-label="Select background color"
            color={backgroundColor}
            onColorChange={handleBackgroundColorChange}
          />
          <ColorPickerButton
            icon={<FaFont />}
            aria-label="Select font color"
            color={fontColor}
            onColorChange={handleFontColorChange}
          />
        </HStack>
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
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
    <>
      <Header title="Home" />
      <CreatePostModal isOpen={isOpen} onClose={onClose} />
      <FlexArea p={2} display={{ base: "none", sm: "flex" }}>
        <Box mr={2}>
          <Avatar />
        </Box>
        <CreatePostForm flex={1} />
      </FlexArea>
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
      <FloatingButton onClick={onOpen} aria-label="New post" />
    </>
  );
}
