import * as dotenv from 'dotenv';

export const get = async (request) => {
    const code = request.url.searchParams.get('code');
    const uuid = request.url.searchParams.get('state');
    if (!code || !uuid) { return { status: 400 } }
    dotenv.config();
    const token = await fetch('https://api.gitkraken.com/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "grant_type": "authorization_code",
            "client_id": process.env['GITKRAKEN_CLIENT_ID'],
            "client_secret": process.env['GITKRAKEN_CLIENT_SECRET'],
            code
        })
    }).then(i => i.json());
    const addUser = await fetch(`http://localhost:3000/api/sessions/${uuid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "token": token['access_token'],
            "type": "Glo",
        })
    }).then(i => i.json());
    return {
        headers: { Location: `/${uuid}` },
        status: 302
    }
}