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

export interface Token {
    gitkrakenId: string;
    type: TokenType;
    token: string;
    createdOn?: string;
}

export interface Session {
    gitkrakenBoardId: string;
    gitkrakenBoardName: string;
    gitkrakenBoardMemberIds: string[];
    createdBy: string;
    createdOn: string;
}