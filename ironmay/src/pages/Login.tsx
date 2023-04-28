// import React, { useEffect, useState, useContext } from 'react';
import { Button, Container, Form } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import AuthContext from "../context/AuthProvider";
import { LoginCredentials } from '../network/users_api';
import * as UserApi from '../network/users_api';

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<LoginCredentials>();

    async function onSubmit(input: LoginCredentials) {
        try {
          await UserApi.login(input);
          navigate("/home");
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Container>
        <h1>Sign In</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email"
                  isInvalid={!!errors.email}
                  {...register("email", { required: "Email Required" })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password"
                  isInvalid={!!errors.password}
                  {...register("password", { required: "Password Required" })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
                {/* <Form.Text muted>
                    Forgot password? click <a href="#">here</a> to reset it.
                </Form.Text> */}
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
              >
                Sign In
            </Button>
            <br/>
            <Form.Text muted>
                    Not a user? click <a href="/signup">here</a> to sign up.
            </Form.Text>
        </Form>

        </Container>
      );
}
 
export default Login;