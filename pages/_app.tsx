import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import Head from "next/head";

import { theme } from "../theme";
import { AuthProvider } from "../context";
import { HeaderProvider } from "../context/HeaderContext";
import { Header } from "../components/Header";

function MyApp({ Component, pageProps }) {
  const extendedTheme = extendTheme(theme);

  return (
    <>
      <Head>
        <title>simple-feed</title>
        <meta
          name="description"
          content="Simple feed where users can post, comment and like!"
        />
      </Head>
      <ChakraProvider theme={extendedTheme}>
        <AuthProvider>
          <HeaderProvider>
            <Container minH="100vh" maxW="container.md" px={2} pb={2}>
              <Header />
              <Component {...pageProps} />
            </Container>
          </HeaderProvider>
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
