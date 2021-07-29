import React, { useState } from 'react'
import { useContext } from 'react';

type SetUserInfoType = (user: unknown, session: unknown) => void; 

interface AuthContextI {
  user?: unknown;
  session?: unknown;
  setUserInfo?: SetUserInfoType; 
}

const AuthContext = React.createContext<AuthContextI>({})

export function AuthProvider({children}) {
  const [session, setSession] = useState<unknown>();
  const [user, setUser] = useState<unknown>();

  const setUserInfo: SetUserInfoType = (user, session) => {
    setUser(user)
    setSession(session);
  }
  
  return <AuthContext.Provider value={{session, user, setUserInfo}}>{children}</AuthContext.Provider>
  
}

export function useAuth() {
  return useContext(AuthContext);
}