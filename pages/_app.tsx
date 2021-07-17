import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import "tailwindcss/tailwind.css";
import { supabase } from "../api";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-0 mt-4">
        {user}
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
