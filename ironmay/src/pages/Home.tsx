import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from "react-bootstrap";

import AuthContext from "../context/AuthProvider";
import NavBar from "../components/NavBar";
import { Team } from "../models/team";
import { User } from "../models/user";
import { Activity } from "../models/activity";
import * as TeamApi from '../network/teams_api';
import * as UserApi from '../network/users_api';
import * as ActivityApi from '../network/activities_api';

interface TeamTableData{
    name: string,
    runDistance: number,
    bikeDistance: number,
    swimDistance: number,
}


const Home = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [users, setUsers] = useState<User[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamData, setTeamData] = useState<TeamTableData[]>([]);

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

    useEffect (() => {
        async function getAllActivityData(){
            try {
                const activities = await ActivityApi.getAllActivities();
                setActivities(activities);
            } catch (error) {
                console.log(error);
            }
        }
        getAllActivityData();
    }, []);

    useEffect (() => {
        async function getTeamsData(){
            try {
                const teams = await TeamApi.fetchTeams();
                setTeams(teams);
                console.log(teams);
            } catch (error) {
                console.log(error);
            }
        }
        getTeamsData();
    }, []);

    useEffect (() => {
        async function TeamTableData(){

            const getActivityTotals = (teamId: string, activityType: string): number => {
                const teamMembers = users.filter((user) => user.team === teamId);
                const teamActivities = activities.filter((activity) => 
                    teamMembers.some((user) => user._id === activity.user));
                const activityTypeActivities = teamActivities.filter((activity) => activity.activity_type === activityType);
                const totalDistance = activityTypeActivities.reduce((total, activity) => total + activity.distance, 0);
                return totalDistance;
            };
            const teamsWithTotals = teams.map((team) => {
                const runTotal =  getActivityTotals(team._id, "run");
                const bikeTotal = getActivityTotals(team._id, "bike");
                const swimTotal = getActivityTotals(team._id, "swim");
                return {teamName: team.name, runTotal, bikeTotal, swimTotal};
            });

            setTeamData(teamsWithTotals.map((x: any) => ({
                name: x.teamName,
                runDistance: x.runTotal,
                bikeDistance: x.bikeTotal,
                swimDistance: x.swimTotal
            })) as TeamTableData[]);
        }
        TeamTableData();
    }, [activities, teams, users]);

    return (
        <>
            <NavBar
              loggedInUser={null}
              onLogoutSuccessfull={ () => {navigate("/login")}}
            />
            <h1>Welcome {auth?.firstName}</h1>
            {users.map((user) => (
                <p key={user._id}>{user.firstName}</p>
            ))}

            <p>---------------------</p>
            {activities.map((activity) => (
                <p key ={activity._id}>{activity.activity_type}</p>
            ))}

            <table>
                <thead>
                    <tr>
                    <th>Team Name</th>
                    <th>Running</th>
                    <th>Cycling</th>
                    <th>Swimming</th>
                    </tr>
                </thead>
                <tbody>
                    {teamData.map((team) =>
                        <tr key={team.name}>
                            <td>{team.name}</td>
                            <td>{team.runDistance}</td>
                            <td>{team.bikeDistance}</td>
                            <td>{team.swimDistance}</td>
                        </tr>
                    )}
                    {/* {teams.map((team) => (
                    <tr key={team._id}>
                        <td>{team.name}</td>
                        <td>{getActivityTotals(team._id)["run"] || 0}</td>
                        <td>{getActivityTotals(team._id)["bike"] || 0}</td>
                        <td>{getActivityTotals(team._id)["swim"] || 0}</td>
                    </tr>
                    ))} */}
                </tbody>
                </table>

        </>
      );
}
 
export default Home;