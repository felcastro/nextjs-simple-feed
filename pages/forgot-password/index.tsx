import { useEffect } from "react";
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
import { NextLink } from "../../components/NextLink";
import { useHeader } from "../../context/HeaderContext";

export default function ForgotPassword() {
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
          <Input placeholder="E-mail" isDisabled={true} />
          <FormErrorMessage></FormErrorMessage>
        </FormControl>
        <Button colorScheme="brand" isDisabled={true}>
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
