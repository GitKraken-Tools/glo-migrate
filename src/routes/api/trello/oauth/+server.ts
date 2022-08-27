import { Auth, tokens } from '$lib/oauth';
import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from "@sveltejs/kit";

export const GET = async (event: RequestEvent) => {
    const uuid = event.url.searchParams.get('uuid');
    const gitkrakenId = event.url.searchParams.get('gitkrakenId');

    if (!uuid || !gitkrakenId) { throw error(500); }

    const authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
    const appName = "Glo Migrator";
    const scope = 'read,write';
    const expiration = 'never';

    const getUrl: Promise<string> = new Promise((resolve, reject) => {
        Auth(uuid, gitkrakenId).getOAuthRequestToken((error: any, token: any, tokenSecret: any, results: any) => {
            tokens[token] = tokenSecret;
            resolve(`${authorizeURL}?oauth_token=${token}&name=${appName}&scope=${scope}&expiration=${expiration}`);
        });
    });

    let url: string = await getUrl;

    throw redirect(307, url);

}