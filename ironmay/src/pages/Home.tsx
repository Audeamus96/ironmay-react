import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";

import AuthContext from "../context/AuthProvider";
import NavBar from "../components/NavBar";

const Home = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext)

    useEffect (() => {
        if (!auth){
            console.error("NOT AUTHORIZED");
            navigate("/login");
        }
    }, [auth, navigate]);

    return (
        <>
            <NavBar
              loggedInUser={null}
              onLogoutSuccessfull={ () => {navigate("/login")}}
            />
            <h1>Welcome {auth?.firstName}</h1>
        </>
      );
}
 
export default Home;