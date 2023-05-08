export interface User {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    team: string,
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