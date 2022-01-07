import { Auth, tokens } from '$lib/oauth';

export const get = async (request) => {
    const uuid = request.url.searchParams.get('uuid');
    const gloId = request.url.searchParams.get('gloId');
    const token = request.url.searchParams.get('oauth_token');
    const verifier = request.url.searchParams.get('oauth_verifier');
    const tokenSecret = tokens[token];

    console.log('TOKENS', tokens)
    console.log('Token', tokens[token]);

    const saveCreds = new Promise((resolve, reject) => {
        Auth(uuid, gloId).getOAuthAccessToken(token, tokenSecret, verifier, async function (error, accessToken, accessTokenSecret, results) {
            // In a real app, the accessToken and accessTokenSecret should be stored

            console.log('tokens', accessToken, accessTokenSecret);
            await fetch(`http://localhost:3000/api/sessions/${uuid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "token": { accessToken, accessTokenSecret },
                    "gloId": gloId,
                    "type": "Trello",
                })
            }).then(i => i.json());
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