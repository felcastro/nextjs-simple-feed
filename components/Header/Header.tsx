import {
  HStack,
  Heading,
  Link,
  FlexProps,
  IconButton,
  HeadingProps,
  LinkProps,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { FlexArea } from "../FlexArea";

const BackButton = () => {
  const router = useRouter();

  return (
    <IconButton
      icon={<FaArrowLeft />}
      aria-label="Go back"
      variant="ghost"
      colorScheme="brand"
      isRound
      mr={2}
      onClick={() => router.back()}
    />
  );
};

const HeaderTitle = ({ children, ...props }: HeadingProps) => (
  <Heading as="span" size="lg" fontWeight="extrabold" mr={2} {...props}>
    {children}
  </Heading>
);

const HeaderLinkItem = ({ children, ...props }: LinkProps) => (
  <Link as={NextLink} style={{color: "white"}} {...props}>
    {children}
  </Link>
);

export interface HeaderProps extends FlexProps {
  title: string;
  hasBackButton?: boolean;
}

export const Header = ({ title, hasBackButton, ...props }: HeaderProps) => {
  return (
    <FlexArea
      position="sticky"
      zIndex="sticky"
      top="0"
      align="center"
      h={14}
      mb={2}
      px={2}
      {...props}
    >
      {hasBackButton && <BackButton />}
      <HeaderTitle>{title}</HeaderTitle>
      <HStack flex={1} justify="flex-end">
        <HeaderLinkItem href="/signin">SignIn</HeaderLinkItem>
      </HStack>
    </FlexArea>
  );
};
