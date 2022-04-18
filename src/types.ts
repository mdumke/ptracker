export interface Update {
    value: number
    createdAt: Date
}

export interface Project {
    id: string,
    title: string,
    target: number,
    createdAt: Date,
    updatedAt: Date,
    archived?: boolean,
    updates: Update[]
}

export interface Projects {
    [key: string]: Project
}