import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from "react-bootstrap";
import { useForm } from 'react-hook-form';

import { Team as TeamModel } from '../models/team';
import Team from '../components/Team';
import * as TeamsApi from "../network/teams_api";
import AddTeamDialog from '../components/AddTeamDialog';
import { SignUpCredentials } from '../network/users_api';
import * as UserApi from '../network/users_api';


const SignUp = () => {
  const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<SignUpCredentials>();

  async function onSubmit(input: SignUpCredentials) {
    try {
      await UserApi.signUp(input);
    } catch (error) {
        console.error(error);
        alert(error);
    }
}

  // adding/displaying teams
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
      <Form onSubmit={handleSubmit(onSubmit)}>

        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="John"
            isInvalid={!!errors.firstName}
            {...register("firstName", { required: "First Name Required" })}
          />
          <Form.Control.Feedback type="invalid">
                {errors.firstName?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control 
            type="text"
            placeholder="Smith"
            isInvalid={!!errors.lastName}
            {...register("lastName", { required: " Last Name Required" })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.lastName?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="name@example.com"
            isInvalid={!!errors.email}
            {...register("email", { required: "Email Required" })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Team Select</Form.Label>
          <Form.Select 
            aria-label="Default select example"
            isInvalid={!!errors.team}
            {...register("team", { required: "Must Choose a Team" })}
          >
            <option value="">Choose a team</option>
            {teams.map((team) => (
              <option key={team.name} value={team._id}> {team.name} </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.team?.message}
          </Form.Control.Feedback>
          <Form.Text muted>
            Or create a team by{" "}
            <a href="#" onClick={() => setShowAddTeamDialog(true)}>
              clicking here
            </a>
          </Form.Text>
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
        </Form.Group>

        <Button 
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          >
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
 
export default SignUp;