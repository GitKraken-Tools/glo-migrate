import * as oauth from 'oauth';
import * as dotenv from 'dotenv';

export let tokens = {};

dotenv.config();

const requestURL = "https://trello.com/1/OAuthGetRequestToken";
const accessURL = "https://trello.com/1/OAuthGetAccessToken";

const key = process.env['TRELLO_CLIENT_KEY'];
const secret = process.env['TRELLO_CLIENT_SECRET'];

export let Auth = (uuid, gloId) => {
    const loginCallback = `http://localhost:3000/api/oauth/trello?uuid=${uuid}&gloId=${gloId}`;
    return new oauth.OAuth(requestURL, accessURL, key, secret, "1.0A", loginCallback, "HMAC-SHA1");
}