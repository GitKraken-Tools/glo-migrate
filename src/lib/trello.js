import { Auth } from '$lib/oauth';

export const trello = (creator) => {
    const tokens = creator.tokens.find(i => i.type === 'Trello').token;
    return {
        board: (name) => new Promise((resolve, reject) => {
            Auth(null, creator.gitkrakenId).getProtectedResource(`https://api.trello.com/1/boards?name=${name}&defaultLists=false&defaultLabels=false&desc=Migrated from GitKraken Glo`, "POST", tokens.accessToken, tokens.accessTokenSecret, function (error, data, response) {
                resolve(JSON.parse(data));
            });
        }),
        list: (boardId, name, index) => new Promise((resolve, reject) => {
            Auth(null, creator.gitkrakenId).getProtectedResource(`https://api.trello.com/1/boards/${boardId}/lists?name=${name}`, "POST", tokens.accessToken, tokens.accessTokenSecret, function (error, data, response) {
                resolve(JSON.parse(data));
            });
        })
    }
}