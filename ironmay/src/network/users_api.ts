import { User } from "../models/user";

// throws error if response code is not "ok"
async function fetchWithError(input: RequestInfo, init?: RequestInit){
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    }else{
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchWithError("/api/users/", {method: "GET"});
    const userData = await response.json();
    const user: User = {
        _id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        team: userData.team
    }
    return user;
}

export interface SignUpCredentials {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    team: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchWithError("/api/users/signup",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })
    return response.json();
}

export interface LoginCredentials {
    email: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchWithError("/api/users/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })
    return response.json();
}

export async function logout() {
    await fetchWithError("api/users/logout", {method: "POST"});
}

export async function getUsersData(): Promise<User[]> {
    const response = await fetchWithError("/api/users/all", {method: "GET"});
    const users = await response.json();
    return users.map((user: any) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        team: user.team
    })) as User[]
}

export interface UserSummary {
    id: string,
    teamId: string,
    firstName: string,
    lastName: string,
    runningTotal: number,
    bikingTotal: number,
    swimmingTotal: number,
}

export async function getUserSummaries(): Promise<UserSummary[]> {
    const response = await fetchWithError("/api/users/summary");
    const userSummaries = await response.json();
    return userSummaries.map((userSummary: any) => ({
        id: userSummary.userId,
        teamId: userSummary.teamId,
        firstName: userSummary.firstName,
        lastName: userSummary.lastName,
        runningTotal: userSummary.runningDistance,
        bikingTotal: userSummary.bikingDistance,
        swimmingTotal: userSummary.swimmingDistance,
    })) as UserSummary[]
}