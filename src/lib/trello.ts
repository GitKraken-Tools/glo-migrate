import { Auth } from "./oauth";
import type { TrelloToken } from "./types";

export const trello = (gitkrakenId: string, tokens: TrelloToken) => {
    return {
        board: (name: string) => new Promise((resolve, reject) => {
            Auth(null, gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/boards?name=${name}&defaultLists=false&defaultLabels=false&desc=Migrated from GitKraken Glo`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error: any, data: any, response: any) {
                resolve(JSON.parse(data));
            });
        }),
        list: (boardId: string, name: string) => new Promise((resolve, reject) => {
            Auth(null, gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/boards/${boardId}/lists?name=${name}`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error: any, data: any, response: any) {
                resolve(JSON.parse(data));
            });
        }),
        label: (boardId: string, name: string, color: string) => new Promise((resolve, reject) => {
            Auth(null, gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/boards/${boardId}/labels?name=${name}&color=${color}`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error: any, data: any, response: any) {
                resolve(JSON.parse(data));
            });
        }),
        card: (listId: string, name: string, desc: string, due: string, memberIds: string[], labelIds: string[]) => new Promise((resolve, reject) => {
            let url = `https://api.trello.com/1/cards?idList=${listId}&name=${name}`;
            if (desc) { url += `&desc=${desc}`; }
            if (due) { url += `&due=${due}`; }
            if (memberIds) { url += `&idMembers=${memberIds.join()}`; }
            if (labelIds) { url += `&idLabels=${labelIds.join()}`; }
            Auth(null, gitkrakenId).getProtectedResource(encodeURI(url), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error: any, data: any, response: any) {
                resolve(JSON.parse(data));
            });
        }),
        comment: (cardId: string, text: string) => new Promise((resolve, reject) => {
            Auth(null, gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/cards/${cardId}/actions/comments?text=${text}`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error: any, data: any, response: any) {
                resolve(JSON.parse(data));
            });
        }),
        checklist: (cardId: string) => new Promise((resolve, reject) => {
            Auth(null, gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/checklists?idCard=${cardId}&name=Task List`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error: any, data: any, response: any) {
                resolve(JSON.parse(data));
            });
        }),
        checkitem: (checklistId: string, name: string, checked: boolean) => new Promise((resolve, reject) => {
            Auth(null, gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/checklists/${checklistId}/checkItems?name=${name}&checked=${checked}`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error: any, data: any, response: any) {
                resolve(JSON.parse(data));
            });
        }),
    }
}