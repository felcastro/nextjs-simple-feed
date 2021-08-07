import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormErrorMessage,
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
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { ColorResult } from "react-color";
import { FaEdit, FaFillDrip, FaFont } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { supabase } from "../supabaseApi";
import { FlexArea } from "../components/FlexArea";
import { ColorPickerButton } from "../components/ColorPickerButton";
import { Header } from "../components/Header";
import { Post } from "../components/Post";
import { feedService } from "../services";
import { FeedPostI, PostI } from "../services/feed.service";
import { useForm } from "react-hook-form";
import { useAuth } from "../context";
import { NextLink } from "../components/NextLink";

const FloatingButton = (props: IconButtonProps) => (
  <IconButton
    icon={<FaEdit />}
    position="fixed"
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

interface ICreatePostFormInput {
  post: string;
}

const createPostFormSchema = yup.object().shape({
  post: yup.string().min(1).max(500).required(),
});

const CreatePostForm = ({ ...props }: StackProps) => {
  const { user } = useAuth();
  const toast = useToast();
  const [backgroundColor, setBackgroundColor] = useState<string>();
  const [fontColor, setFontColor] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ICreatePostFormInput>({
    resolver: yupResolver(createPostFormSchema),
  });
  const watchPostContent = watch("post", "");

  function handleBackgroundColorChange(color: ColorResult) {
    setBackgroundColor(color.hex);
  }

  function handleFontColorChange(color: ColorResult) {
    setFontColor(color.hex);
  }

  async function onSubmit(data) {
    const { post } = data;

    const { error } = await supabase.from("posts").insert({
      user_uuid: user.id,
      content: post,
      font_color: fontColor,
      background_color: backgroundColor,
    });

    if (error) {
      toast({
        isClosable: true,
        position: "top-right",
        title: `Error during sign in`,
        description: error.message,
        status: "error",
      });
    } else {
      setValue("post", "");
    }
  }

  return (
    <Stack as="form" {...props} onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="post" isInvalid={!!errors.post}>
        <Textarea
          placeholder="Post something!"
          maxLength={500}
          maxH="xs"
          bg={backgroundColor ? backgroundColor : "inherit"}
          color={fontColor ? fontColor : "inherit"}
          borderColor={fontColor ? fontColor : "inherit"}
          disabled={isSubmitting}
          {...register("post")}
        />
        <FormHelperText>
          {watchPostContent ? 500 - watchPostContent.length : 500} characters
          left
        </FormHelperText>
        <FormErrorMessage>
          {errors.post && errors.post.message}
        </FormErrorMessage>
      </FormControl>
      <Flex align="center">
        <HStack flex={1}>
          <ColorPickerButton
            icon={<FaFillDrip />}
            aria-label="Select background color"
            color={backgroundColor}
            onColorChange={handleBackgroundColorChange}
            isLoading={isSubmitting}
          />
          <ColorPickerButton
            icon={<FaFont />}
            aria-label="Select font color"
            color={fontColor}
            onColorChange={handleFontColorChange}
            isLoading={isSubmitting}
          />
        </HStack>
        <Button
          type="submit"
          colorScheme="brand"
          size="sm"
          isLoading={isSubmitting}
        >
          Send
        </Button>
      </Flex>
    </Stack>
  );
};

const SignInWarn = () => (
  <Box>
    <Text as="span">
      Please <NextLink href="/signin">sign in </NextLink>
      to post.
    </Text>
  </Box>
);

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const { user } = useAuth();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{user ? <CreatePostForm /> : <SignInWarn />}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState<FeedPostI[]>([]);
  const toast = useToast();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const loader = useRef(null);

  useEffect(() => {
    const subscription = supabase
      .from<PostI>("posts")
      .on("INSERT", async (post) => {
        const data = await feedService.getFeedByUuid(post.new.uuid);
        setPosts((p) => [data, ...p]);
        setPage((p) => p + 1);
      })
      .on("DELETE", async (post) => {
        setPosts((p) => p.filter((p) => p.uuid !== post.old.uuid));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPosts = useCallback(
    async (entities) => {
      const target = entities[0];
      if (target.isIntersecting && hasMorePosts) {
        try {
          const data = await feedService.getFeed(page);

          if (data) {
            if (data.length < 10) {
              setHasMorePosts(false);
            } else {
              setPage(page + 10);
            }

            setPosts((p) => [...p, ...data]);
          }
        } catch (err) {
          toast({
            title: "Error loading posts.",
            description: "An error has ocurred while loading the feed posts.",
            status: "error",
            isClosable: true,
          });
        }
      }
    },
    [hasMorePosts, page, toast]
  );

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(loadPosts, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loadPosts]);

  return (
    <>
      <Header title="Home" />
      <CreatePostModal isOpen={isOpen} onClose={onClose} />
      <FlexArea p={2} display={{ base: "none", sm: "flex" }}>
        {user ? (
          <>
            <Box mr={2}>
              <Avatar />
            </Box>
            <CreatePostForm flex={1} />
          </>
        ) : (
          <SignInWarn />
        )}
      </FlexArea>
      <Divider my={2} display={{ base: "none", sm: "block" }} />
      <Stack spacing={2}>
        {posts.map((p) => (
          <Post
            key={p.uuid}
            uuid={p.uuid}
            ownerUuid={p.owner_uuid}
            avatarUrl={p.owner_avatar_url}
            creatorUsername={p.owner_username}
            createdAt={p.created_at}
            content={p.content}
            fontColor={p.font_color}
            backgroundColor={p.background_color}
          />
        ))}
        <Flex ref={loader} justifyContent="center" minH={8}>
          {hasMorePosts && <Spinner color="brand.500" />}
        </Flex>
      </Stack>
      <FloatingButton onClick={onOpen} aria-label="New post" />
    </>
  );
}
