import Image, { ImageProps } from "next/image";
import { FaUser } from "react-icons/fa";

export interface AvatarProps {
  src?: string;
  alt?: string;
}

export const Avatar = ({ src, alt, ...props }: AvatarProps) => {
  return (
    <div
      className="m-1 mr-2 w-12 h-12 relative flex justify-center items-center rounded-full text-xl uppercase border"
      {...props}
    >
      {src ? <Image src={src} alt={alt} layout="fill" /> : <FaUser />}
    </div>
  );
};
