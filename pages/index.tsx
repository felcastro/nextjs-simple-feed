import {
  Divider,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
  IconButtonProps,
  Text,
  SlideFade,
  Fade,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaEdit } from "react-icons/fa";

import { supabase } from "../supabaseApi";
import { Post } from "../components/Post";
import { feedService } from "../services";
import { FeedPostI, PostI } from "../services/feed.service";
import { useAuth } from "../context";
import { NextLink } from "../components/NextLink";
import { CreatePostForm } from "../components/CreatePostForm";
import { CreatePostBlock } from "../components/CreatePostBlock";
import { useHeader } from "../context/HeaderContext";
import { CreatePostModal } from "../components/CreatePostModal";

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

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState<FeedPostI[]>([]);
  const toast = useToast();
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const loader = useRef(null);
  const { setOptions } = useHeader();

  useEffect(() => {
    setOptions({ title: "Home", hasBackButton: false });
  }, [setOptions]);

  useEffect(() => {
    // TODO find way to listen to view, and filter listen by parent_uuid=is.null
    const subscription = supabase
      .from<PostI>("posts")
      .on("INSERT", async (post) => {
        if (!post.new.parent_uuid) {
          const data = await feedService.getFeedByUuid(post.new.uuid);
          setPosts((p) => [{ ...data, isNew: true }, ...p]);
          setPage((p) => p + 1);
        } else {
          setPosts((oldPosts) =>
            oldPosts.map((p) => {
              if (p.uuid === post.new.parent_uuid) {
                p.comments_count++;
              }

              return p;
            })
          );
        }
      })
      .on("DELETE", async (post) => {
        if (!post.old.parent_uuid) {
          setPosts((p) => p.filter((p) => p.uuid !== post.old.uuid));
        } else {
          setPosts((oldPosts) =>
            oldPosts.map((p) => {
              if (p.uuid === post.new.parent_uuid) {
                p.comments_count--;
              }

              return p;
            })
          );
        }
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
      <CreatePostBlock />
      <Divider my={2} display={{ base: "none", sm: "block" }} />
      <Stack spacing={2}>
        {posts.map((p) =>
          p.isNew ? (
            <SlideFade key={p.uuid} in={p.isNew} offsetY="20px">
              <Post
                uuid={p.uuid}
                ownerUuid={p.owner_uuid}
                parentUuid={p.parent_uuid}
                avatarUrl={p.owner_avatar_url}
                creatorUsername={p.owner_username}
                createdAt={p.created_at}
                content={p.content}
                commentsCount={p.comments_count}
              />
            </SlideFade>
          ) : (
            <Fade key={p.uuid} in={true}>
              <Post
                uuid={p.uuid}
                ownerUuid={p.owner_uuid}
                parentUuid={p.parent_uuid}
                avatarUrl={p.owner_avatar_url}
                creatorUsername={p.owner_username}
                createdAt={p.created_at}
                content={p.content}
                commentsCount={p.comments_count}
              />
            </Fade>
          )
        )}
        <Flex ref={loader} justifyContent="center" minH={8}>
          {hasMorePosts && <Spinner color="brand.500" />}
        </Flex>
      </Stack>
      <FloatingButton onClick={onOpen} aria-label="New post" />
      <CreatePostModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
