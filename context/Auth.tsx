import { Session, User } from "@supabase/supabase-js";
import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../api";

interface AuthContextI {
  user?: User;
  session?: Session;
}

const AuthContext = React.createContext<AuthContextI>({});

export function AuthProvider({ children }) {
  const [session, setSession] = useState<Session>();
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
    const session = supabase.auth.session();
    setUser(user);
    setSession(session);
  }

  return (
    <AuthContext.Provider value={{ session, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
