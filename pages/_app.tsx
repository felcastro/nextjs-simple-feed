import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import { theme } from "../theme";
import { AuthProvider } from "../context";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const extendedTheme = extendTheme(theme);

  return (
    <>
      <Head>
        <title>simple-feed</title>
        <meta name="description" content="Simple feed where users can post, comment and like!" />
      </Head>
      <ChakraProvider theme={extendedTheme}>
        <AuthProvider>
          <Container minH="100vh" maxW="container.md" px={2} pb={2}>
            <Component {...pageProps} />
          </Container>
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
