import {
  HStack,
  Heading,
  FlexProps,
  IconButton,
  HeadingProps,
  Divider,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { supabase } from "../../api";
import { useAuth } from "../../context";
import { FlexArea } from "../FlexArea";
import { NextLink } from "../NextLink";

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
  <Heading
    as="span"
    size={useBreakpointValue({ base: "sm", sm: "lg" })}
    fontWeight="extrabold"
    mr={2}
    {...props}
  >
    {children}
  </Heading>
);

const HeaderAuthenticatedLinks = () => (
  <>
    <NextLink href="/">Home</NextLink>
    <Divider orientation="vertical" h={4} />
    <Button
      colorScheme="blue"
      variant="link"
      onClick={() => supabase.auth.signOut()}
    >
      Logout
    </Button>
  </>
);

const HeaderUnauthenticatedLinks = () => (
  <>
    <NextLink href="/">Home</NextLink>
    <Divider orientation="vertical" h={4} />
    <NextLink href="/signin">Sign in</NextLink>
    <Divider orientation="vertical" h={4} />
    <NextLink href="/signup">Sign up</NextLink>
  </>
);

export interface HeaderProps extends FlexProps {
  title: string;
  hasBackButton?: boolean;
}

export const Header = ({ title, hasBackButton, ...props }: HeaderProps) => {
  const { user } = useAuth();

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
      <HStack
        flex={1}
        justify="flex-end"
        display={{ base: "none", sm: "flex" }}
      >
        {user ? <HeaderAuthenticatedLinks /> : <HeaderUnauthenticatedLinks />}
      </HStack>
      <HStack
        flex={1}
        justify="flex-end"
        display={{ base: "flex", sm: "none" }}
      >
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            icon={<FaBars />}
            colorScheme="brand"
            variant="ghost"
          />
          <MenuList minW="unset">
            <MenuItem as={NextLink} href="/">
              Home
            </MenuItem>
            <MenuItem as={NextLink} href="/signin">
              Sign in
            </MenuItem>
            <MenuItem as={NextLink} href="/signup">
              Sign up
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </FlexArea>
  );
};
