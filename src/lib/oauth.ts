import * as oauth from 'oauth';

export let tokens = {};

const requestURL = "https://trello.com/1/OAuthGetRequestToken";
const accessURL = "https://trello.com/1/OAuthGetAccessToken";

const key = import.meta.env.VITE_TRELLO_CLIENT_KEY;
const secret = import.meta.env.VITE_TRELLO_CLIENT_SECRET;

export let Auth = (uuid: string | null, gitkrakenId: string) => {
    const loginCallback = `http://localhost:3000/api/trello/oauth/callback?uuid=${uuid}&gitkrakenId=${gitkrakenId}`;
    return new oauth.OAuth(requestURL, accessURL, key, secret, "1.0A", loginCallback, "HMAC-SHA1");
}