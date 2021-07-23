import { useState } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Button,
  Text,
} from "@chakra-ui/react";
import { FlexArea } from "../../components/FlexArea";
import { Header } from "../../components/Header";
import { NextLink } from "../../components/NextLink";

export default function SignUp() {
  const [isLoading, setLoading] = useState<boolean>();

  return (
    <>
      <Header title="Sign up" hasBackButton />
      <FlexArea direction="column" px={2} py={16} align="center">
        <Heading as="h2" size="md">
          Create an account
        </Heading>
        <Stack as="form" mt={4} w="xs">
          <FormControl id="username">
            <Input disabled={isLoading} placeholder="Username" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl id="email">
            <Input disabled={isLoading} placeholder="E-mail" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl id="password">
            <Input disabled={isLoading} placeholder="Password" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <Button colorScheme="brand" isLoading={isLoading}>
            Sign up
          </Button>
          <Box textAlign="center">
            <Text as="span">
              Already have an account?{" "}
              <NextLink as={NextLink} href="/signin">
                Sign in
              </NextLink>
              .
            </Text>
          </Box>
        </Stack>
      </FlexArea>
    </>
  );
}
