import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';

import * as UserApi from "./network/users_api";
import Routes from "./routes/Routes";
import AuthContext, { AuthContextProvider } from "./context/AuthProvider";
import { User } from "./models/user";

function App() {
    // const [auth, setAuth] = useState<User | null>(null);
    const { auth, setAuth } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true);
    // const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await UserApi.getLoggedInUser();
                console.log(user);
                setAuth(user);
                console.log(auth?.firstName);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLoggedInUser();
    });

    if(isLoading) {
        return <div>Loading</div>;
    }

  return (
    <AuthContextProvider value={{auth, setAuth}}>
        <Router>
            <Routes />
        </Router>
    </AuthContextProvider>
  );
}

export default App;
