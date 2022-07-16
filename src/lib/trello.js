import { Auth } from '$lib/oauth';

export const trello = (creator) => {
    const tokens = creator.tokens.find(i => i.type === 'Trello').token;
    return {
        board: (name) => new Promise((resolve, reject) => {
            Auth(null, creator.gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/boards?name=${name}&defaultLists=false&defaultLabels=false&desc=Migrated from GitKraken Glo`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error, data, response) {
                resolve(JSON.parse(data));
            });
        }),
        list: (boardId, name) => new Promise((resolve, reject) => {
            Auth(null, creator.gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/boards/${boardId}/lists?name=${name}`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error, data, response) {
                resolve(JSON.parse(data));
            });
        }),
        label: (boardId, name, color) => new Promise((resolve, reject) => {
            Auth(null, creator.gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/boards/${boardId}/labels?name=${name}&color=${color}`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error, data, response) {
                resolve(JSON.parse(data));
            });
        }),
        card: (listId, name, desc, due, memberIds, labelIds) => new Promise((resolve, reject) => {
            let url = `https://api.trello.com/1/cards?idList=${listId}&name=${name}`;
            if (desc) { url += `&desc=${desc}`; }
            if (due) { url += `&due=${due}`; }
            if (memberIds) { url += `&idMembers=${memberIds.join()}`; }
            if (labelIds) { url += `&idLabels=${labelIds.join()}`; }
            Auth(null, creator.gitkrakenId).getProtectedResource(encodeURI(url), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error, data, response) {
                resolve(JSON.parse(data));
            });
        }),
        checklist: (cardId) => new Promise((resolve, reject) => {
            Auth(null, creator.gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/checklists?idCard=${cardId}&name=Task List`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error, data, response) {
                resolve(JSON.parse(data));
            });
        }),
        checkitem: (checklistId, name, checked) => new Promise((resolve, reject) => {
            Auth(null, creator.gitkrakenId).getProtectedResource(encodeURI(`https://api.trello.com/1/checklists/${checklistId}/checkItems?name=${name}&checked=${checked}`), "POST", tokens.accessToken, tokens.accessTokenSecret, function (error, data, response) {
                resolve(JSON.parse(data));
            });
        }),
    }
}