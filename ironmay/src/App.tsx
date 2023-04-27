import React, { useEffect, useState } from 'react';
import * as UserApi from "./network/users_api";
import { BrowserRouter as Router} from 'react-router-dom';
import { User } from "./models/user"
import Routes from "./routes/Routes";
import { AuthContextProvider } from "./context/AuthProvider";

function App() {

    // const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    // useEffect(() => {
    //     async function fetchLoggedInUser() {
    //         try {
    //             const user = await UserApi.getLoggedInUser();
    //             setLoggedInUser(user);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     fetchLoggedInUser();
    // }, []);

  return (
    <>
    <AuthContextProvider>
        <Router>
            <Routes />
        </Router>
    </AuthContextProvider>
    </>
  );
}

export default App;
