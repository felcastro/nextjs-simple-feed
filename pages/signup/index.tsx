import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FlexArea } from "../../components/FlexArea";
import { Header } from "../../components/Header";
import { NextLink } from "../../components/NextLink";
import { supabase } from "../../supabaseApi";
import { useRouter } from "next/router";
import { authService } from "../../services";

type InputType = {
  value: string;
};

interface FormEventElement {
  username: InputType;
  email: InputType;
  password: InputType;
}

type DivElementEvent = FormEventElement & HTMLDivElement;

export default function SignUp() {
  const [isLoading, setLoading] = useState<boolean>();
  const router = useRouter();
  const toast = useToast();

  async function onSubmit(e: React.FormEvent<DivElementEvent>) {
    e.preventDefault();
    const defaultToastSettings = {
      isClosable: true,
    };

    try {
      setLoading(true);

      const { username, email, password } = e.currentTarget;

      await authService.signUp({
        username: username.value,
        email: email.value,
        password: password.value,
      });

      toast({
        ...defaultToastSettings,
        title: `User created`,
        status: "success",
      });

      const { error } = await supabase.auth.signIn({
        email: email.value,
        password: password.value,
      });

      if (error) {
        router.push("/signin");
      } else {
        router.push("/");
      }
    } catch (err) {
      toast({
        ...defaultToastSettings,
        title: `An error occurred while creating your user`,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header title="Sign up" hasBackButton />
      <FlexArea direction="column" px={2} py={16} align="center">
        <Heading as="h2" size="md">
          Create an account
        </Heading>
        <Stack
          as="form"
          mt={4}
          w={{ base: "100%", sm: "xs" }}
          onSubmit={onSubmit}
        >
          <FormControl id="username">
            <Input disabled={isLoading} placeholder="Username" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input disabled={isLoading} placeholder="E-mail" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              disabled={isLoading}
              placeholder="Password"
              type="password"
            />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={isLoading}>
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
