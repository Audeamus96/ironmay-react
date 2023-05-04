import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tabs, Tab, Row, Col, Container, Alert } from "react-bootstrap";

import '../styles/login.css';
import styleUtils from '../styles/utils.module.css';


import AuthContext from "../context/AuthProvider";
import NavBar from "../components/NavBar";
import AddActivityForm from "../components/AddActivityForm";
import { Team } from "../models/team";
import { User } from "../models/user";
import { Activity } from "../models/activity";
import * as TeamApi from '../network/teams_api';
import * as UserApi from '../network/users_api';
import * as ActivityApi from '../network/activities_api';

const calcIronMen = (rd:number, bd:number): number => {
    const perc_runn = rd/42.2;
    const perc_cycl = bd/180.2;
    const min_irons = Math.floor(Math.min(perc_runn, perc_cycl));

    const val_run = perc_runn - min_irons;
    const val_cycl = perc_cycl - min_irons;

    const total_run = val_run >= 1 ? .5 : val_run * .5;
    const total_cycl = val_cycl >= 1 ? .5 : val_cycl * .5;

    const ironmen = total_run + total_cycl + min_irons;
    const ans = Math.ceil(ironmen * 100) / 100;
    return Math.round(ans * 100) / 100;
}

const round2decimals = (num:number) => {
    return Math.round(num * 100) /100;
}

const Home = () => {
    interface TeamTableData{
        _id: string,
        name: string,
        runDistance: number,
        bikeDistance: number,
        swimDistance: number,
        ironmen: number,
    }
    
    interface UserTableData{
        _id: string,
        firstName: string,
        lastName: string,
        team: string,
        runDistance: number,
        bikeDistance: number,
        swimDistance: number
    }

    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [users, setUsers] = useState<User[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [showAlert, setShowAlert] = useState(false);

    // Data for ables`
    const [teamData, setTeamData] = useState<TeamTableData[]>([]);
    const [userData, setuserData] = useState<UserTableData[]>([]);

    const handleAlert = () => {
        setShowAlert(true);
    
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
    };

    useEffect (() => {
        if (!auth){
            console.error("NOT AUTHORIZED - redirecting to login");
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
                const ironmen = calcIronMen(runTotal, bikeTotal);
                return {teamId: team._id ,teamName: team.name, runTotal, bikeTotal, swimTotal, ironmen};
            });

            setTeamData(teamsWithTotals.filter((team) => team.teamName !== 'admin')
            .map((x: any) => ({
                _id: x.teamId,
                name: x.teamName,
                runDistance: x.runTotal,
                bikeDistance: x.bikeTotal,
                swimDistance: x.swimTotal,
                ironmen: x.ironmen,
            })) as TeamTableData[]);
        }
        TeamTableData();
    }, [activities, teams, users]);

    useEffect (() => {
        const getActivityTotals = (userId: string, activityType: string): number => {
            const userActivities = activities.filter((activity) => userId === activity.user);
            const activityTypeActivities = userActivities.filter((activity) => activity.activity_type === activityType);
            const totalDistance = activityTypeActivities.reduce((total, activity) => total + activity.distance, 0);
            return totalDistance;
        };

        async function UserTableTotals() {
            const usersWithTotals = users.map((user) => {
                const runTotal =  getActivityTotals(user._id, "run");
                const bikeTotal = getActivityTotals(user._id, "bike");
                const swimTotal = getActivityTotals(user._id, "swim");
                return {userID: user._id, firstName: user.firstName, 
                    lastName: user.lastName, team: user.team,
                    runTotal, bikeTotal, swimTotal }
            });
            setuserData(usersWithTotals.map((x: any) => ({
                _id: x.userID,
                firstName: x.firstName,
                lastName: x.lastName,
                team: x.team,
                runDistance: x.runTotal,
                bikeDistance: x.bikeTotal,
                swimDistance: x.swimTotal,
            })) as UserTableData[]);
        }
        UserTableTotals();
    }, [activities, users])

    return (
        <>
            <NavBar
              loggedInUser={null}
              onLogoutSuccessfull={ () => {navigate("/login")}}
            />
        <div className='bg'>   
        <Container className='home template 100-w 100-vh'>
            <Row className="justify-content-md-center">
                <Col lg={8} className='form'>
                <Table>
                    <thead>
                        <tr>
                        <th>Rank</th>
                        <th>Team Name</th>
                        <th>Running / Walking</th>
                        <th>Cycling</th>
                        <th>Ironmen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamData.sort((a,b) => b.ironmen - a.ironmen).map((team, index) =>
                            <tr key={team.name}>
                                <td>{index+1}</td>
                                <td>{team.name}</td>
                                <td>{round2decimals(team.runDistance)}</td>
                                <td>{round2decimals(team.bikeDistance)}</td>
                                {/* <td>{team.swimDistance}</td> */}
                                <td>{team.ironmen}</td>
                            </tr>
                        )}
                    </tbody>
                    </Table>
                    <br/>
                {teamData.length > 0 && (
                    <Tabs defaultActiveKey={auth?.team}>
                        {teamData.map((team) =>(
                            <Tab eventKey={team._id} title={team.name} key={team._id}>
                                <Table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Running / Walking (km) </th>
                                    <th>Cycling (km) </th>
                                </tr>
                                </thead>
                                <tbody>
                                    {userData.filter((user) => user.team === team._id).map((user) =>
                                        <tr key={user._id}>
                                            <td>{user.firstName} {user.lastName}</td>
                                            <td>{round2decimals(user.runDistance)}</td>
                                            <td>{round2decimals(user.bikeDistance)}</td>
                                        </tr>
                                    )}
                                </tbody>
                                </Table>
                            </Tab>
                        ))}
                    </Tabs>
                )}
                </Col>
                <Col lg={4} className={styleUtils.marginTop20}>
                {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)}>
                    Activity Added!
                    </Alert>
                )}
                <div className='form'>
                    <AddActivityForm  
                        onActivityAdded={(newActivity) => {
                            setActivities([...activities, newActivity]);
                            handleAlert();
                            }
                        }
                    />
                </div>
                </Col>
            </Row>
        </Container>
        </div> 
        </>
      );
}
 
export default Home;