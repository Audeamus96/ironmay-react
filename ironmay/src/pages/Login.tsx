import React, { useEffect, useState, useContext } from 'react';
import { Button, Container, Form } from "react-bootstrap";

import AuthContext from "../context/AuthProvider";

const Login = () => {

    return (
        <Container>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
                {/* <Form.Text muted>
                    Forgot password? click <a href="#">here</a> to reset it.
                </Form.Text> */}
            </Form.Group>

            <Button variant="primary" type="submit">
                Sign In
            </Button>
        </Form>

        </Container>
      );
}
 
export default Login;