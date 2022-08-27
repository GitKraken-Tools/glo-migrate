import { Auth, tokens } from '$lib/oauth';
import { create } from '$lib/supabase';
import { Tables, TokenType, type Token } from '$lib/types';
import { error, redirect, type RequestEvent } from "@sveltejs/kit";

export const GET = async (event: RequestEvent) => {
    const uuid = event.url.searchParams.get('uuid');
    const gitkrakenId = event.url.searchParams.get('gitkrakenId');
    const token = event.url.searchParams.get('oauth_token');

    if (!token || !gitkrakenId) {
        throw error(500);
    }

    const verifier = event.url.searchParams.get('oauth_verifier');
    const tokenSecret = tokens[token];

    await new Promise((resolve, reject) => {
        Auth(uuid, gitkrakenId).getOAuthAccessToken(token, tokenSecret, verifier, async function (error, accessToken, accessTokenSecret, results) {
            if (accessToken && accessTokenSecret) {
                await create(Tables.TOKENS, {gitkrakenId, type: TokenType.TRELLO, token: {accessToken, accessTokenSecret}} as Token)
            }
            resolve(true);
        });
    });

    throw redirect(307, `/${uuid}`);
}