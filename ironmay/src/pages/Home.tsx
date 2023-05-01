import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";

import AuthContext from "../context/AuthProvider";
import NavBar from "../components/NavBar";
import { User } from "../models/user"
import * as UserApi from '../network/users_api';


const Home = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [users, setUsers] = useState<User[]>([]);

    useEffect (() => {
        if (!auth){
            console.error("NOT AUTHORIZED");
            navigate("/login");
        }
    }, [auth, navigate]);

    useEffect (() => {
        async function getUserData(){
            try {
                const users = await UserApi.getUsersData();
                setUsers(users);
            } catch (error) {
                console.log(error);
            }
        }
        getUserData();
    }, []);

    return (
        <>
            <NavBar
              loggedInUser={null}
              onLogoutSuccessfull={ () => {navigate("/login")}}
            />
            <h1>Welcome {auth?.firstName}</h1>
            {users.map((user) => (
                <p>{user.firstName}</p>
            ))}
        </>
      );
}
 
export default Home;