import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tabs, Tab, Row, Col, Container, Alert } from "react-bootstrap";

import '../styles/login.css';
import styleUtils from '../styles/utils.module.css';

import AuthContext from "../context/AuthProvider";
import NavBar from "../components/NavBar";
import { calcIronMen, round2decimals } from '../utils/util_functions';
import { UserSummary } from '../models/user';
import { TeamSummary } from '../models/team';
import AddActivityForm from "../components/AddActivityForm";
import { Activity } from "../models/activity";
import * as TeamApi from '../network/teams_api';
import * as UserApi from '../network/users_api';
import * as ActivityApi from '../network/activities_api';

interface TeamSummaryCalc extends TeamSummary{
    ironmen: number
}

const Home = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [activities, setActivities] = useState<Activity[]>([]);
    const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);
    const [teamSummaries, setTeamSummaries] = useState<TeamSummaryCalc[]>([]);
    const [showAlert, setShowAlert] = useState(false);

    const triggerAlert = () => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
    };

    const addActivity = (newActivity: Activity) => {

    }

    useEffect (() => {
        if (!auth){
            console.error("NOT AUTHORIZED - redirecting to login");
            navigate("/login");
        }
    }, [auth, navigate]);

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
        async function getSummaries() {
            try {
                const userSummaries = await UserApi.getUserSummaries();
                setUserSummaries(userSummaries);

                const teamSummaries = await TeamApi.getTeamSummaries();
                setTeamSummaries(teamSummaries.map((teamSummary: TeamSummary) => ({
                    id: teamSummary.id,
                    name: teamSummary.name,
                    runningTotal: teamSummary.runningTotal,
                    bikingTotal: teamSummary.bikingTotal,
                    swimmingTotal: teamSummary.swimmingTotal,
                    ironmen: calcIronMen(teamSummary.runningTotal, teamSummary.bikingTotal),
                })) as TeamSummaryCalc[]);
            } catch (error) {
                console.log(error);
            }
        }
        getSummaries();
    }, [activities])

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
                        {
                            teamSummaries
                            .filter((team) => team.name !== 'admin') // admin team is for testing
                            .sort((a, b) => b.ironmen - a.ironmen)
                            .map((team, index) => 
                                <tr key={team.name}>
                                    <td>{index+1}</td>
                                    <td>{team.name}</td>
                                    <td>{round2decimals(team.runningTotal)}</td>
                                    <td>{round2decimals(team.bikingTotal)}</td>
                                    <td>{round2decimals(team.ironmen)}</td>
                                </tr>
                            )
                        }
                    </tbody>
                    </Table>
                    <br/>
                {teamSummaries.length > 0 && (
                    <Tabs defaultActiveKey={auth?.team}>
                        {
                            teamSummaries
                            .filter((team) => team.name !== 'admin')
                            .map((team) => (
                                <Tab eventKey={team.id} title={team.name} key={team.id}>
                                <Table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Running / Walking (km) </th>
                                    <th>Cycling (km) </th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        userSummaries
                                        .filter((user) => user.teamId === team.id)
                                        .map((user) => 
                                            <tr key={user.id}>
                                            <td>{user.firstName} {user.lastName}</td>
                                            <td>{round2decimals(user.runningTotal)}</td>
                                            <td>{round2decimals(user.bikingTotal)}</td>
                                            </tr>     
                                        )
                                    }
                                </tbody>
                                </Table>
                                </Tab>
                            ))
                        }
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
                            addActivity(newActivity);
                            triggerAlert();
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