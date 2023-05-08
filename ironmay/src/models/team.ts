export interface Team {
    _id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
}

export interface TeamSummary {
    id: string,
    name: string,
    runningTotal: number,
    bikingTotal: number,
    swimmingTotal: number,
}