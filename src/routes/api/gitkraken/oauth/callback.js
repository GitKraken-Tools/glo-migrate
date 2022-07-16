import { db } from "$lib/db";
import GloSDK from "@axosoft/glo-sdk";

export const get = async (event) => {
    const code = event.url.searchParams.get('code');
    const uuid = event.url.searchParams.get('state');
    if (!code || !uuid) { return { status: 400 } }
    // Get bearer token
    const token = await fetch('https://api.gitkraken.com/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "grant_type": "authorization_code",
            "client_id": import.meta.env.VITE_GITKRAKEN_CLIENT_ID,
            "client_secret": import.meta.env.VITE_GITKRAKEN_CLIENT_SECRET,
            code
        })
    }).then(i => i.json());
    // Get Glo user
    const user = await GloSDK(token.access_token).users.getCurrentUser();
    // Add user item
    let profile = await db('users').select('*').where('gitKrakenId', user.id);
    if (profile.length === 0) {
        profile = {
            gitkrakenUsername: user.username,
            gitKrakenId: user.id,
            tokens: JSON.stringify([
                {
                    type: 'GitKraken',
                    id: user.id,
                    token: token.access_token
                }
            ]),
            createdOn: new Date().getTime()
        };
        await db('users').insert(profile);
    }
    return {
        headers: { 
            Location: '/',
            'Set-Cookie': `gitKrakenId=${user.id}; Path=/`,
        },
        status: 302
    }
}