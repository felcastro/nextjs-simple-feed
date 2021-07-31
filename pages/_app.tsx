import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import { theme } from "../theme";
import { AuthProvider } from "../context";

function MyApp({ Component, pageProps }) {
  const extendedTheme = extendTheme(theme);

  return (
    <ChakraProvider theme={extendedTheme}>
      <AuthProvider>
        <Container minH="100vh" maxW="container.md" px={2} pb={2}>
          <Component {...pageProps} />
        </Container>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
