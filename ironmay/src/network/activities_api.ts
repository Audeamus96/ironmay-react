import { Activity } from "../models/activity";

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

export async function getUsersActivities(): Promise<Activity[]> {
    const response = await fetchWithError("/api/activities/", {method: "GET"});
    const activities = await response.json();
    return activities.map((activity: any) => ({
        _id: activity._id,
        activity_type: activity.activity_type,
        distance: activity.distance,
        user: activity.user,
        team: activity.team,
        createdAt: activity.createdAt
    })) as Activity[]
}

export async function getAllActivities(): Promise<Activity[]> {
    const response = await fetchWithError("/api/activities/all/", {method: "GET"});
    const activities = await response.json();
    return activities.map((activity: any) => ({
        _id: activity._id,
        activity_type: activity.activity_type,
        distance: activity.distance,
        user: activity.user,
        team: activity.team,
        createdAt: activity.createdAt
    })) as Activity[]
}

export interface ActivityCreationBody {
    activity_type: string,
    distance: number,
    user: string,
    team: string,
}

export async function createActivity(activityBody: ActivityCreationBody): Promise<Activity> {
    console.log(activityBody);
    const response = await fetchWithError("/api/activities/",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(activityBody),
    })
    return response.json();
}