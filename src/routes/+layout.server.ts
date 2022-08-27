import { getCookie } from '$lib/cookies';
import { find } from '$lib/supabase';
import { Tables, TokenType, type Token } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoadEvent } from './$types';

export const load = async (event: LayoutServerLoadEvent) => {

    const cookies = event.request.headers.get('cookie') || '';
    const gitkrakenId = getCookie(cookies, 'gitkrakenId');

    if (!gitkrakenId || (!gitkrakenId && event.url.pathname !== '/login')) {
        throw redirect(307, '/login');
    }

    const tokens = await find(Tables.TOKENS, 'gitkrakenId', gitkrakenId);
    const sessions = await find(Tables.SESSIONS, 'gitkrakenId', gitkrakenId);
    const profile = await find(Tables.PROFILES, 'gitkrakenId', gitkrakenId).then(i => i[0]);

    return {
        profile,
        sessions,
        tokens
    }
}