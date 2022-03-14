import { Auth, tokens } from '$lib/oauth';

export const get = async (request) => {
    const uuid = request.url.searchParams.get('uuid');
    const gloId = request.url.searchParams.get('gloId');

    const authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
    const appName = "Glo Migrator";
    const scope = 'read,write';
    const expiration = '1hour';

    const getUrl = new Promise((resolve, reject) => {
        Auth(uuid, gloId).getOAuthRequestToken((error, token, tokenSecret, results) => {
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