import { Box, BoxProps } from "@chakra-ui/react";
import { useRouter } from "next/router";

export interface LinkRoleBoxProps extends BoxProps {
  href: string;
}

export const LinkRoleBox = ({ href, children, ...props }: LinkRoleBoxProps) => {
  const router = useRouter();

  return (
    <Box
      role="link"
      tabIndex={0}
      cursor="pointer"
      onClick={() => router.push(href)}
      {...props}
    >
      {children}
    </Box>
  );
};
