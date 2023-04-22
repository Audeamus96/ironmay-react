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
    return response.json();
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