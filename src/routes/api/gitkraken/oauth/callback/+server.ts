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

    // 
    // const profiles: Profile[] = await select(Tables.PROFILES);

    // const single: Profile = await find(Tables.PROFILES, 'gitkrakenId', '1bf4d7cb-4e0c-4e27-bcbf-d0f60699ba01').then(i => i[0] as Profile);

    // console.log(single);
    // return json({token})

    return new Response(null, {
        headers: { 
            Location: '/',
            'Set-Cookie': `gitKrakenId=${user.id}; Path=/`,
        },
        status: 302
    })

    // console.log(firebase)
    // const users = await get();

    // const fbdoc = await doc(firebase.db, "users", "FYfZ3h6zXqLINFylNf2Y")
    // const data = fbdoc.;
    // console.log(users);
    // return json({users, fbdoc, data})
}