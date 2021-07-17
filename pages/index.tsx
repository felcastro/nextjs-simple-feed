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
    <div>
      <div className="divide-y space-y-4">
        <Header />
        <div className="flex flex-col space-y-4 pt-4">
          {posts.map((p) => (
            <Post
              key={p.id}
              avatarUrl={p.avatarUrl}
              creatorUsername={p.creatorUsername}
              createdAt={p.createdAt}
              content={p.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
