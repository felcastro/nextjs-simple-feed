import { format } from "date-fns";
import { Avatar } from "../Avatar";

const PostLeftColor = (props) => (
  <div className="w-1 rounded-l-md bg-green-300" {...props} />
);

export interface PostProps {
  avatarUrl: string;
  creatorUsername: string;
  createdAt: Date;
  content: string;
}

export const Post = ({
  avatarUrl,
  creatorUsername,
  createdAt,
  content,
  ...props
}: PostProps) => (
  <div className="flex bg-white shadow rounded-md" {...props}>
    <PostLeftColor />
    <div className="flex flex-1 py-2 px-1 space-x-2">
      <div>
        <Avatar />
      </div>
      <div className="flex-1">
        <span className="block">{creatorUsername}</span>
        <span className="block leading-none text-sm text-gray-600">
          {format(createdAt, "yyyy-MM-dd HH:mm")}
        </span>
        <div className="mt-2">
          <p>{content}</p>
        </div>
      </div>
    </div>
  </div>
);
