import { Avatar } from "../Avatar";

export const Header = (props) => {
  return (
    <div className="bg-white flex p-2 space-x-2 shadow" {...props}>
      <div>
        <Avatar />
      </div>
      <div className="flex-1 pt-2">
        <input placeholder="Post something!" />
      </div>
    </div>
  );
};
