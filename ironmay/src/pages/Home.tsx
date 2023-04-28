import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";

import NavBar from "../components/NavBar";

const Home = () => {
    const navigate = useNavigate();
    const [redir, setRedir] = useState(false);

    return (
        <>
            <NavBar
              loggedInUser={null}
              onLogoutSuccessfull={ () => {navigate("/login")}}
            />
            <h1>Welcome </h1>
        </>
      );
}
 
export default Home;