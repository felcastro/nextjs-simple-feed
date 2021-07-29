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
import { supabase } from "../../api";
import { useAuth } from "../../context";

type InputType = {
  value: string,
}

interface FormEventElement {
  email: InputType
  password: InputType
}

type DivElementEvent = FormEventElement & HTMLDivElement;

export default function SignUp() {
  const [isLoading, setLoading] = useState<boolean>();
  const { setUser, setSession } = useAuth();
  const toast = useToast();

  async function onSubmit(e: React.FormEvent<DivElementEvent>) {
    e.preventDefault();
    const defaultToastSettings = {
      isClosable: true,
    }
    setLoading(true);
    const{ user, session, error } = await supabase.auth.signUp({
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    })
    if(error) {
      toast({
        ...defaultToastSettings,
        title: `An error occured while creating your user`,
        status: "error",
      })

    } else {
      setUser(user);
      setSession(session);
      toast({
        ...defaultToastSettings,
        title: `User created`,
        status: "success",
      })
    }
    setLoading(false);
  }

  return (
    <>
      <Header title="Sign up" hasBackButton />
      <FlexArea direction="column" px={2} py={16} align="center">
        <Heading as="h2" size="md">
          Create an account
        </Heading>
        <Stack as="form" mt={4} w="xs" onSubmit={onSubmit}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input disabled={isLoading} placeholder="E-mail" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input disabled={isLoading} placeholder="Password" type="password" />
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
