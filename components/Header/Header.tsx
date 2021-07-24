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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaArrowLeft, FaBars } from "react-icons/fa";
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
      <HStack
        flex={1}
        justify="flex-end"
        display={{ base: "none", sm: "flex" }}
      >
        <>
          <NextLink href="/">Home</NextLink>
          <Divider orientation="vertical" h={4} />
          <NextLink href="/signin">Sign in</NextLink>
          <Divider orientation="vertical" h={4} />
          <NextLink href="/signup">Sign up</NextLink>
        </>
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
