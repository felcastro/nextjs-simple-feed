import { useState } from "react";
import {
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

export default function SignIn() {
  const [isLoading, setLoading] = useState<boolean>();

  return (
    <>
      <Header title="Sign in" hasBackButton />
      <FlexArea direction="column" px={2} py={16} align="center">
        <Heading as="h2" size="md">
          Inform your credentials
        </Heading>
        <Stack as="form" mt={4} w={{ base: "100%", sm: "xs" }}>
          <FormControl id="email">
            <Input disabled={isLoading} placeholder="E-mail" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl id="password">
            <Input disabled={isLoading} placeholder="Password" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <Button colorScheme="brand" isLoading={isLoading}>
            Sign in
          </Button>
          <Stack textAlign="center">
            <NextLink href="/forgot-password">Forgot your password?</NextLink>
            <Text as="span">
              New here?{" "}
              <NextLink as={NextLink} href="/signup">
                Create an account
              </NextLink>
              .
            </Text>
          </Stack>
        </Stack>
      </FlexArea>
    </>
  );
}
