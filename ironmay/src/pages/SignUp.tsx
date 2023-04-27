import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from "react-bootstrap";

import { Team as TeamModel } from '../models/team';
import Team from '../components/Team';
import * as TeamsApi from "../network/teams_api";
import AddTeamDialog from '../components/AddTeamDialog';

const Login = () => {
  const [teams, setTeams] = useState<TeamModel[]>([]);

  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);

  useEffect(() => {
    async function loadTeams() {
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
    <Container>
      <Form>

      <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" placeholder="John" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="Smith" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Team Select</Form.Label>
          <Form.Select aria-label="Default select example">
            <option>Choose a team</option>
            {teams.map((team) => (
              <option value={team.name}> {team.name} </option>
            ))}
          </Form.Select>
          <Form.Text muted>
            Or create a team by{" "}
            <a href="#" onClick={() => setShowAddTeamDialog(true)}>
              clicking here
            </a>
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      {showAddTeamDialog && (
        <AddTeamDialog
          onDismiss={() => setShowAddTeamDialog(false)}
          onTeamSaved={(newTeam) => {
            setTeams([...teams, newTeam]);
            setShowAddTeamDialog(false);
          }}
        />
      )}

    </Container>
  );
};
 
export default Login;