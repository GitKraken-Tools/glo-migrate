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
    await fetch(`http://${event.url.host}/api/tokens`, {method: 'POST', body: JSON.stringify({
        sessionId: uuid,
        type: 'GitKraken',
        sourceToken: token.access_token,
        sourcePrincipal: JSON.stringify(user)
    })});
    return {
        headers: { Location: `/${uuid}` },
        status: 302
    }
}