import { getCookie } from '$lib/cookies';
import { contains, find, select } from '$lib/supabase';
import { Tables, TokenType, type Profile, type Session, type Token } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoadEvent } from './$types';

export const load = async (event: LayoutServerLoadEvent) => {

    const cookies = event.request.headers.get('cookie') || '';
    const gitkrakenId = getCookie(cookies, 'gitkrakenId');

    if (!gitkrakenId && event.url.pathname !== '/login') {
        throw redirect(307, '/login');
    }

    const tokens: Token[] = await select(Tables.TOKENS);
    const sessions: Session[] = await contains(Tables.SESSIONS, 'gitkrakenBoardMemberIds', gitkrakenId);
    const profile: Profile = await find(Tables.PROFILES, 'gitkrakenId', gitkrakenId).then(i => i[0] as Profile);

    let activeProfiles: { [key: string]: number; } = {};
    sessions.map(i => i as Session).forEach(i => {
        if (!i.id) { return }
        activeProfiles[i.id] = i.gitkrakenBoardMemberIds.filter(j => tokens.find(k => k.type === TokenType.TRELLO && k.gitkrakenId === j)).length;
    });

    return {
        profile,
        sessions,
        tokens: tokens.filter(i => i.gitkrakenId === gitkrakenId),
        activeProfiles
    }
}