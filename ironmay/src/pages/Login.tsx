import React, { useEffect, useState } from 'react';
import { Button, Form } from "react-bootstrap";

import { Team as TeamModel } from '../models/team';
import Team from '../components/Team';
import * as TeamsApi from "../network/teams_api";

const Login = () => {

  const [teams, setTeams] = useState<TeamModel[]>([]);

  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);

  useEffect(() => {
    async function loadTeams(){
        try {
            const teams = await TeamsApi.fetchTeams();
            setTeams(teams);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    loadTeams();
  }, []);


    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
      );
}
 
export default Login;