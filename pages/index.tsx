import { Box, Divider, Stack } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Post } from "../components/Post";

export default function Home() {
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
      <Header />
      <Divider my={2} />
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
    </Box>
  );
}
