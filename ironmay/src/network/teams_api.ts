import { Team } from "../models/team";

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

export async function fetchTeams(): Promise<Team[]> {
    const response = await fetchWithError("/api/teams", {method: "GET"});
    return response.json();
}

export interface TeamInput{
    name: string,
}
export async function createTeam(team: TeamInput): Promise<Team> {
    const response = await fetchWithError("/api/notes", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(team),
    });

    return response.json();
}