import { Box, BoxProps } from "@chakra-ui/react";
import { useRouter } from "next/router";

export interface LinkRoleBoxProps extends BoxProps {
  href: string;
  ignoreSelection?: boolean;
}

export const LinkRoleBox = ({
  href,
  ignoreSelection = false,
  children,
  ...props
}: LinkRoleBoxProps) => {
  const router = useRouter();

  return (
    <Box
      role="link"
      tabIndex={0}
      cursor="pointer"
      onClick={() => {
        const selection = window.getSelection().toString();
        if (ignoreSelection || selection.length <= 0) {
          router.push(href);
        }
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
