import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button } from 'react-bootstrap';
import { Team as TeamModel } from './models/team';
import Team from './components/Team';
import * as TeamsApi from "./network/teams_api";
import * as UserApi from "./network/users_api";
import AddTeamDialog from './components/AddTeamDialog';
import NavBar from './components/NavBar';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from "./pages/Login"
import { User } from "./models/user"

function App() {

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await UserApi.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLoggedInUser();
    }, []);

//   const [teams, setTeams] = useState<TeamModel[]>([]);

//   const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);

//   useEffect(() => {
//     async function loadTeams(){
//         try {
//             const teams = await TeamsApi.fetchTeams();
//             setTeams(teams);
//         } catch (error) {
//             console.error(error);
//             alert(error);
//         }
//     }
//     loadTeams();
//   }, []);

  return (
    <>
    {/* <div>
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
    </div> */}
    <Router>
        <Routes>
            <Route path="login" element={<LoginPage />} />
        </Routes>
    </Router>
    
    </>
  );
}

export default App;
