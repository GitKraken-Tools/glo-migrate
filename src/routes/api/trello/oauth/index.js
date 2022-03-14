import { Auth, tokens } from '$lib/oauth';
import * as oauth from 'oauth';

export const get = async (event) => {
    const uuid = event.url.searchParams.get('uuid');
    const gitkrakenId = event.url.searchParams.get('gitkrakenId');

    const authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
    const appName = "Glo Migrator";
    const scope = 'read,write';
    const expiration = 'never';

    const getUrl = new Promise((resolve, reject) => {
        Auth(uuid, gitkrakenId).getOAuthRequestToken((error, token, tokenSecret, results) => {
            tokens[token] = tokenSecret;
            resolve(`${authorizeURL}?oauth_token=${token}&name=${appName}&scope=${scope}&expiration=${expiration}`);
        });
    });

    let url = await getUrl;

    return {
        headers: { Location: url },
        status: 302
    }

}