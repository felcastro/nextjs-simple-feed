import {
  Divider,
  Flex,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

import { supabase } from "../../supabaseApi";
import { Post } from "../../components/Post";
import { feedService } from "../../services";
import { FeedPostI, PostI } from "../../services/feed.service";
import { useRouter } from "next/router";
import { useHeader } from "../../context/HeaderContext";
import { FloatingButton } from "../../components/FloatingButton";
import { FaComment } from "react-icons/fa";
import { CreatePostModal } from "../../components/CreatePostModal";

export default function PostActivity() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [parentPost, setParentPost] = useState<FeedPostI>();
  const [posts, setPosts] = useState<FeedPostI[]>([]);
  const toast = useToast();
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(false);
  const loader = useRef(null);
  const { uuid: postUuid } = router.query;
  const { setOptions } = useHeader();

  useEffect(() => {
    setOptions({ title: "Post Activity", hasBackButton: true });
  }, [setOptions]);

  useEffect(() => {
    async function loadParentPost() {
      try {
        const data = await feedService.getFeedByUuid(postUuid as string);

        setParentPost(data);
      } catch (err) {
        toast({
          title: "Error loading post activity.",
          description: "An error has ocurred while loading the post activity.",
          status: "error",
          isClosable: true,
        });
      }
    }

    if (postUuid) {
      setPosts([]);
      setHasMorePosts(true);
      setPage(0);
      loadParentPost();
    }
  }, [postUuid, toast]);

  useEffect(() => {
    if (postUuid) {
      const subscription = supabase
        .from<PostI>(`posts:parent_uuid=eq.${postUuid}`)
        .on("INSERT", async (post) => {
          const data = await feedService.getFeedByUuid(post.new.uuid);
          setParentPost((p) => ({
            ...p,
            comments_count: p.comments_count + 1,
          }));
          setPosts((p) => [data, ...p]);
          setPage((p) => p + 1);
        })
        .on("DELETE", async (post) => {
          setParentPost((p) => ({
            ...p,
            comments_count: p.comments_count - 1,
          }));
          setPosts((p) => p.filter((p) => p.uuid !== post.old.uuid));
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [postUuid]);

  const loadPosts = useCallback(
    async (entities) => {
      const target = entities[0];
      if (target.isIntersecting && hasMorePosts && postUuid) {
        try {
          const data = await feedService.getFeedByParentPost(
            page,
            postUuid as string
          );

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
            title: "Error loading post activity.",
            description:
              "An error has ocurred while loading the post activity.",
            status: "error",
            isClosable: true,
          });
        }
      }
    },
    [hasMorePosts, page, toast, postUuid]
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
      {parentPost && (
        <CreatePostModal
          isOpen={isOpen}
          onClose={onClose}
          postParentUuid={parentPost.uuid}
          isReply
        />
      )}
      {parentPost && (
        <Post
          key={parentPost.uuid}
          uuid={parentPost.uuid}
          ownerUuid={parentPost.owner_uuid}
          parentUuid={parentPost.parent_uuid}
          avatarUrl={parentPost.owner_avatar_url}
          creatorUsername={parentPost.owner_username}
          createdAt={parentPost.created_at}
          content={parentPost.content}
          commentsCount={parentPost.comments_count}
        />
      )}
      <Divider my={2} />
      <Stack spacing={2}>
        {parentPost &&
          posts.map((p) => (
            <Post
              key={p.uuid}
              uuid={p.uuid}
              ownerUuid={p.owner_uuid}
              parentUuid={p.parent_uuid}
              avatarUrl={p.owner_avatar_url}
              creatorUsername={p.owner_username}
              createdAt={p.created_at}
              content={p.content}
              commentsCount={p.comments_count}
            />
          ))}
        <Flex ref={loader} justifyContent="center" minH={8}>
          {hasMorePosts && <Spinner color="brand.500" />}
        </Flex>
      </Stack>
      {parentPost && (
        <FloatingButton
          icon={<FaComment />}
          aria-label="New comment"
          onClick={onOpen}
        />
      )}
    </>
  );
}
