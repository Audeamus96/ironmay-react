import React from 'react';
import { createContext, useState } from "react";
import { User } from "../models/user";

interface AuthContextValue {
    auth: User | null;
    setAuth: (user: User | null) => void;
  }
  
type AuthContextProps = {
    value: AuthContextValue;
   children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
    auth: null,
    setAuth: () => {},
});

export const AuthContextProvider = ({value, children}: AuthContextProps) => {
    // const [auth, setAuth] = useState<User | null>(null);
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>)
}

export default AuthContext;

