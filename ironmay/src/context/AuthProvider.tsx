import React from 'react';
import { createContext, useState } from "react";
import { User } from "../models/user";

type AuthContextProps = {
   children: React.ReactNode
}

const AuthContext = createContext({});

export const AuthContextProvider = ({children}: AuthContextProps) => {
    const [auth, setAuth] = useState<User | null>(null);
    return <AuthContext.Provider value={{ auth, setAuth }}> {children} </AuthContext.Provider>
}

export default AuthContext;

