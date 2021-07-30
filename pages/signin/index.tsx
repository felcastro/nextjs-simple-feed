import { useState } from "react";
import {
  FormControl,
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

export default function SignIn() {
  const [isLoading, setLoading] = useState<boolean>();
  const { setUserInfo } = useAuth();

  const toast = useToast();
  async function onSubmit(e: React.FormEvent<DivElementEvent>) {
    e.preventDefault();
    const defaultToastSettings = {
      isClosable: true,
    }
    setLoading(true);
    const{ user, session, error } = await supabase.auth.signIn({
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    })
    if(error) {
      toast({
        ...defaultToastSettings,
        title: `An error occured while logging`,
        status: "error",
      })

    } else {
      setUserInfo(user, session)
      toast({
        ...defaultToastSettings,
        title: `Successfully logged`,
        status: "success",
      })
    }
    setLoading(false);
  }

  return (
    <>
      <Header title="Sign in" hasBackButton />
      <FlexArea direction="column" px={2} py={16} align="center">
        <Heading as="h2" size="md">
          Inform your credentials
        </Heading>
        <Stack as="form" mt={4} w={{ base: "100%", sm: "xs" }} onSubmit={onSubmit}>
          <FormControl id="email">
            <Input disabled={isLoading} placeholder="E-mail" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl id="password">
            <Input disabled={isLoading} type="password" placeholder="Password" />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={isLoading}>
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
