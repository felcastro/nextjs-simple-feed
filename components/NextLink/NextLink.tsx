import Link from "next/link";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";

export const NextLink = ({ href = "/", children, ...props }: LinkProps) => (
  <Link href={href} passHref>
    <ChakraLink color="blue.500" {...props}>
      {children}
    </ChakraLink>
  </Link>
);
