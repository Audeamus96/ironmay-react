import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';

import * as UserApi from "./network/users_api";
import Routes from "./routes/Routes";
import AuthContext, { AuthContextProvider } from "./context/AuthProvider";
import { User } from "./models/user";

function App() {
    const [auth, setAuth] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await UserApi.getLoggedInUser();
                setAuth(user);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLoggedInUser();
    }, [setAuth]);

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
