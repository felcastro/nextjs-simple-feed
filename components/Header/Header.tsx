import {
  Flex,
  Heading,
  FlexProps,
  IconButton,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  LinkProps,
  MenuItemProps,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { supabase } from "../../supabaseApi";
import { useAuth } from "../../context";
import { BaseBlock } from "../BaseBlock";
import { NextLink } from "../NextLink";
import { useHeader } from "../../context/HeaderContext";
import { ColorModeButton } from "../ColorModeButton";

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

interface HeaderMenuItemProps extends MenuItemProps {
  title: string;
  href?: string;
  linkProps?: LinkProps;
}

const HeaderMenuItem = ({
  href,
  title,
  linkProps,
  ...props
}: HeaderMenuItemProps) => (
  <MenuItem color="brand.500" {...props}>
    {href ? (
      <NextLink href={href} _hover={{ textDecoration: "none" }} {...linkProps}>
        {title}
      </NextLink>
    ) : (
      title
    )}
  </MenuItem>
);

const HeaderMenu = () => {
  const { user } = useAuth();

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        icon={<FaBars />}
        colorScheme="brand"
        variant="ghost"
        aria-label="Header Actions"
      />
      <MenuList minW="unset">
        {user ? (
          <>
            <HeaderMenuItem href="/" title="Home" />
            <HeaderMenuItem
              title="Logout"
              onClick={async () => await supabase.auth.signOut()}
            />
          </>
        ) : (
          <>
            <HeaderMenuItem href="/" title="Home" />
            <HeaderMenuItem href="/signin" title="Sign in" />
            <HeaderMenuItem href="/signup" title="Sign up" />
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export const Header = (props: FlexProps) => {
  const { title, hasBackButton } = useHeader();

  return (
    <BaseBlock
      as="header"
      position="sticky"
      zIndex="sticky"
      top="0"
      align="center"
      h={14}
      mb={2}
      px={2}
      {...props}
    >
      <Flex flex={1}>
        {hasBackButton && <BackButton />}
        <Heading
          as="h2"
          role="heading"
          size={useBreakpointValue({ base: "sm", sm: "lg" })}
          fontWeight="extrabold"
          mr={2}
        >
          {title}
        </Heading>
      </Flex>
      <ColorModeButton />
      <HeaderMenu />
    </BaseBlock>
  );
};
