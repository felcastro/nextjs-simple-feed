import React, { useState } from 'react'
import { useContext } from 'react';

interface AuthContextI<T, K> {
  user?: Record<string, T>;
  session?: Record<string, K>;
  setUser?: (user: T) => void;
  setSession?: (user: K) => void;
}

const AuthContext = React.createContext<AuthContextI<any, any>>({})

export function AuthProvider({children}) {
  const [session, setSession] = useState();
  const [user, setUser] = useState();
  return <AuthContext.Provider value={{session, user, setSession, setUser}}>{children}</AuthContext.Provider>
  
}

export function useAuth() {
  return useContext(AuthContext);
}