import { json, redirect, error } from '@sveltejs/kit';
import { select, create, find } from '$lib/supabase';
import type { RequestEvent } from './$types';
import { Tables, TokenType, type Profile, type Token } from '$lib/types';
import { gk } from '$lib/gitkraken';

export const GET = async (event: RequestEvent) => {

    const code = event.url.searchParams.get('code');
    if (!code) { throw redirect(307, '/'); }

    const token = await gk().token(code).then(i => i.access_token);
    if (!token) { throw error(403, 'Could not receive token'); }

    const user = await gk(token).user();
    if (!user || !user.id || !user.username) { throw error(403, 'Gitkraken user does not exist'); }
    
    let profile: Profile = await find(Tables.PROFILES, 'gitkrakenId', user.id).then(i => i[0] as Profile);
    if (!profile) {
        await create(Tables.PROFILES, {gitkrakenId: user.id, gitkrakenUsername: user.username} as Profile);
        await create(Tables.TOKENS, {gitkrakenId: user.id, type: TokenType.GITKRAKEN, token} as Token)
    }

    return new Response(null, {
        headers: { 
            Location: '/',
            'Set-Cookie': `gitkrakenId=${user.id}; Path=/`,
        },
        status: 302
    })

}