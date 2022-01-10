import { Auth } from '$lib/oauth';
import * as dotenv from 'dotenv';

export const post = async (request) => {
    // console.log(request.body);
    dotenv.config();
    const { board, session } = JSON.parse(request.body);
    console.log('SESSIOn', session.users);
    const uuid = session.uuid;
    const gloId = session.users[0]['id'];
    const accessToken = session.users[0]['Trello']['accessToken'];
    const accessTokenSecret = session.users[0]['Trello']['accessTokenSecret'];
    console.log('CREDS', accessToken, accessTokenSecret);
    // await fetch(`https://api.trello.com/1/boards?name=GK Test&key=${token}&token=${tokenSecret}`, { method: 'POST' }).then(i => console.log(i))
    Auth(uuid, gloId).getProtectedResource("https://api.trello.com/1/boards?name=GK Test", "POST", accessToken, accessTokenSecret, function (error, data, response) {
        console.log(data);
    });
    return {
        body: request.body
    }
}