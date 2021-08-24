import {
  Box,
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
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { BaseBlock } from "../../components/BaseBlock";
import { NextLink } from "../../components/NextLink";
import { authService } from "../../services";
import { useEffect } from "react";
import { useHeader } from "../../context/HeaderContext";

interface ISignUpFormInput {
  username: string;
  email: string;
  password: string;
}

const signUpFormSchema = yup.object().shape({
  username: yup.string().min(1).max(255).required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function SignUp() {
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISignUpFormInput>({
    resolver: yupResolver(signUpFormSchema),
  });
  const { setOptions } = useHeader();

  useEffect(() => {
    setOptions({ title: "Sign up", hasBackButton: true });
  }, [setOptions]);

  async function onSubmit(data) {
    const defaultToastSettings: UseToastOptions = {
      isClosable: true,
      position: "top-right",
    };

    try {
      const { username, email, password } = data;

      await authService.signUp({
        username,
        email,
        password,
      });

      toast({
        ...defaultToastSettings,
        title: `User created!`,
        description: "Please sign in to start posting.",
        status: "success",
      });

      router.push("/signin");
    } catch (err) {
      toast({
        ...defaultToastSettings,
        title: `Error during sign up`,
        description: err?.response?.data?.message,
        status: "error",
      });
    }
  }

  return (
    <BaseBlock direction="column" px={2} py={16} align="center">
      <Heading as="h2" size="md">
        Create an account
      </Heading>
      <Stack
        as="form"
        mt={4}
        w={{ base: "100%", sm: "xs" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl id="username" isInvalid={!!errors.username}>
          <Input
            disabled={isSubmitting}
            placeholder="Username"
            {...register("username")}
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
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
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <Button type="submit" colorScheme="brand" isLoading={isSubmitting}>
          Sign up
        </Button>
        <Box textAlign="center">
          <Text as="span">
            Already have an account? <NextLink href="/signin">Sign in</NextLink>
            .
          </Text>
        </Box>
      </Stack>
    </BaseBlock>
  );
}
