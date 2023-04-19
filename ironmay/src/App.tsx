import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button } from 'react-bootstrap';
import { Team as TeamModel } from './models/team';
import Team from './components/Team';

function App() {
  const [teams, setTeams] = useState<TeamModel[]>([]);

  useEffect(() => {
    async function loadTeams(){
        try {
            const response = await fetch("/api/teams", {method: "GET"});
            const teams = await response.json();
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
      {teams.map(team => (
        <Team team={team} key={team.name}/>
      ))}
    </div>
  );
}

export default App;
