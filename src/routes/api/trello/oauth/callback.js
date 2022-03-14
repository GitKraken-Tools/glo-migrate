import { Auth, tokens } from '$lib/oauth';
import {db} from "$lib/db";

export const get = async (event) => {
    const uuid = event.url.searchParams.get('uuid');
    const gitkrakenId = event.url.searchParams.get('gitkrakenId');
    const token = event.url.searchParams.get('oauth_token');
    const verifier = event.url.searchParams.get('oauth_verifier');
    const tokenSecret = tokens[token];

    const saveCreds = new Promise((resolve, reject) => {
        Auth(uuid, gitkrakenId).getOAuthAccessToken(token, tokenSecret, verifier, async function (error, accessToken, accessTokenSecret, results) {
            console.log('uuid', uuid);
            console.log('gitkrakenId', gitkrakenId);
            console.log('TOKENS', accessToken, accessTokenSecret);
            // SAVE THE TOKENS TO THE USER
            let profile = await db('users').select('*').where('gitKrakenId', gitkrakenId).then(i => i[0]);
            let tokens = JSON.parse(profile.tokens);
            tokens.push({
                type: 'Trello',
                id: 'N/A',
                token: {accessToken, accessTokenSecret}
            });
            profile.tokens = JSON.stringify(tokens);
            await db('users').update(profile).where('gitkrakenId', gitkrakenId);
            resolve(true);
            // oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", accessToken, accessTokenSecret, function (error, data, response) {
            //     // Now we can respond with data to show that we have access to your Trello account via OAuth
            //     res.send(data)
            // });
        });
    });

    await saveCreds;

    return {
        headers: { Location: `/${uuid}` },
        status: 302
    }
}