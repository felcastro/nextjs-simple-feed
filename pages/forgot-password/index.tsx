import { useEffect, useState } from "react";
import {
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Button,
  Text,
} from "@chakra-ui/react";
import { BaseBlock } from "../../components/BaseBlock";
import { Header } from "../../components/Header";
import { NextLink } from "../../components/NextLink";
import { useHeader } from "../../context/HeaderContext";

export default function ForgotPassword() {
  const [isLoading, setLoading] = useState<boolean>();
  const { setOptions } = useHeader();

  useEffect(() => {
    setOptions({ title: "Password Recovery", hasBackButton: true });
  }, [setOptions]);

  return (
    <BaseBlock direction="column" px={2} py={16} align="center">
      <Heading as="h2" size="md">
        Inform your e-mail
      </Heading>
      <Stack as="form" mt={4} w={{ base: "100%", sm: "xs" }}>
        <FormControl id="email">
          <Input disabled={isLoading} placeholder="E-mail" />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
        <Button colorScheme="brand" isLoading={isLoading} isDisabled={true}>
          Send recovery link
        </Button>
        <Stack textAlign="center">
          <Text as="span">
            Know your password? <NextLink href="/signin">Sign in</NextLink>.
          </Text>
        </Stack>
      </Stack>
    </BaseBlock>
  );
}
