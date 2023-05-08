import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';

import * as UserApi from "./network/users_api";
import Routes from "./routes/Routes";
import { AuthContextProvider } from "./context/AuthProvider";
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
                console.error("No valid session found, authorization not granted");
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
