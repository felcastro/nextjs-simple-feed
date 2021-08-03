import Link from "next/link";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { forwardRef } from "react";

const LinkContent = forwardRef<HTMLAnchorElement>((props: LinkProps, ref) => (
  <ChakraLink ref={ref} color="brand.500" {...props} />
));

LinkContent.displayName = "LinkContent";

export const NextLink = ({ href = "/", children, ...props }: LinkProps) => (
  <Link href={href} passHref>
    <LinkContent {...props}>{children}</LinkContent>
  </Link>
);
