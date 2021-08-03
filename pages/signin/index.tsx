import {
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Button,
  Text,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { FlexArea } from "../../components/FlexArea";
import { Header } from "../../components/Header";
import { NextLink } from "../../components/NextLink";
import { supabase } from "../../supabaseApi";
interface ISignInFormInput {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function SignIn() {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISignInFormInput>({
    resolver: yupResolver(signInFormSchema),
  });

  async function onSubmit(data) {
    const { email, password } = data;

    const defaultToastSettings: UseToastOptions = {
      isClosable: true,
      position: "top-right",
    };

    const { error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      toast({
        ...defaultToastSettings,
        title: `Error during sign in`,
        description: error.message,
        status: "error",
      });
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <Header title="Sign in" hasBackButton />
      <FlexArea direction="column" px={2} py={16} align="center">
        <Heading as="h2" size="md">
          Inform your credentials
        </Heading>
        <Stack
          as="form"
          mt={4}
          w={{ base: "100%", sm: "xs" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl id="email" isInvalid={!!errors.email}>
            <Input
              disabled={isSubmitting}
              placeholder="E-mail"
              {...register("email")}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl id="password" isInvalid={!!errors.password}>
            <Input
              disabled={isSubmitting}
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={isSubmitting}>
            Sign in
          </Button>
          <Stack textAlign="center">
            <NextLink href="/forgot-password">Forgot your password?</NextLink>
            <Text as="span">
              New here? <NextLink href="/signup">Create an account</NextLink>.
            </Text>
          </Stack>
        </Stack>
      </FlexArea>
    </>
  );
}
