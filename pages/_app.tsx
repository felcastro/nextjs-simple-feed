import { useEffect, useState } from "react";
import { ChakraProvider, Box, Container, extendTheme } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../api";
import { theme } from "../theme";

function MyApp({ Component, pageProps }) {
  const extendedTheme = extendTheme(theme);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async () => checkUser());

    checkUser();

    return () => {
      data?.unsubscribe();
    };
  }, []);

  async function checkUser(): Promise<void> {
    const user = supabase.auth.user();
    setUser(user);
  }

  return (
    <ChakraProvider theme={extendedTheme}>
      <Box minH="100vh">
        <Container maxW="container.md" px={2}>
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;
