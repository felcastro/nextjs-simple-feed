import { useEffect, useState } from "react";
import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../api";
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
