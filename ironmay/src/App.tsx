import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button } from 'react-bootstrap';
import { Team as TeamModel } from './models/team';
import Team from './components/Team';
import * as TeamsApi from "./network/teams_api";
import AddTeamDialog from './components/AddTeamDialog';
import NavBar from './components/NavBar';

function App() {
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
    <div>
      <NavBar 
        loggedInUser={null}
        onLogoutSuccessfull={() => {}}
      />
      {teams.map(team => (
        <Team team={team} key={team.name}/>
      ))}
      <Button onClick={() => setShowAddTeamDialog(true)}>
        Add Team
      </Button>
      {showAddTeamDialog && 
        <AddTeamDialog  
            onDismiss={() => setShowAddTeamDialog(false)}
            onTeamSaved={(newTeam) => {
                setTeams([...teams, newTeam])
                setShowAddTeamDialog(false);
            }}
        />
      }
    </div>
  );
}

export default App;
