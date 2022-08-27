export enum Tables {
    PROFILES = 'profiles',
    TOKENS = 'tokens',
    SESSIONS = 'sessions'
}


export enum TokenType {
    GITKRAKEN = 'GITKRAKEN',
    TRELLO = 'TRELLO'
}

export interface Profile {
    gitkrakenId: string;
    gitkrakenUsername: string;
    createdOn?: string;
}

export interface ActiveToken {
    type: TokenType,
    active: boolean
}

export type GitkrakenToken = string;

export interface TrelloToken {
    accessToken: string;
    accessTokenSecret: string;
}

export interface Token {
    id?: string;
    gitkrakenId: string;
    type: TokenType;
    token: GitkrakenToken | TrelloToken;
    createdOn?: string;
}

export interface Session {
    id?: string;
    gitkrakenBoardId: string;
    gitkrakenBoardName: string;
    gitkrakenBoardMemberIds: string[];
    createdBy: string;
    createdOn: string;
}

export interface DetailsMap {
    gitkrakenId: string;
    gitkrakenUsername: string;
    tokens: ActiveToken[]
}