import { getCookie } from '$lib/cookies';
import { contains, find, select } from '$lib/supabase';
import { Tables, TokenType, type DetailsMap, type Profile, type Session, type Token } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoadEvent } from './$types';

export const load = async (event: PageServerLoadEvent) => {

    const parent = await event.parent();
    const id = event.url.pathname.replace('/', '');

    const session = parent.sessions.find(i => i.id === id);

    // const cookies = event.request.headers.get('cookie') || '';
    // const gitkrakenId = getCookie(cookies, 'gitkrakenId');

    if (!session) {
        throw redirect(307, '/');
    }

    const tokens: Token[] = await select(Tables.TOKENS);

    const detailsMap = await Promise.all(
        session.gitkrakenBoardMemberIds.map(async i => {
            const profile: Profile = await find(Tables.PROFILES, 'gitkrakenId', i).then(i => i[0] as Profile);
            return new Promise((resolve, reject) => {
                resolve({
                    gitkrakenId: i,
                    gitkrakenUsername: profile?.gitkrakenUsername,
                    tokens: ['GITKRAKEN', 'TRELLO'].map(j => ({type: j, active: !!tokens.find(k => k.gitkrakenId === i && k.type === j)}))
                });
            });
        })
    );

    return {
        session,
        detailsMap
    }
    
}