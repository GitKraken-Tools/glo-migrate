import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = (event) => {
    const uuid = event.url.searchParams.get('uuid');
    const client_id = import.meta.env.VITE_GITKRAKEN_CLIENT_ID;
    const url = `https://app.gitkraken.com/oauth/authorize?response_type=code&client_id=${client_id}&scope=board:read%20user:read&state=${uuid}`
    throw redirect(307, url);
}