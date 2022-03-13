import {db} from "$lib/db";

// QUERY PARAMS - sessionId
export const get = async (event) => {
    return {
        body: await db('users').select('*').where('sessionId', event.url.searchParams.get('sessionId'))
    }
}

// BODY - sessionId, sourceToken, sourcePrincipal, targetToken, targetPrincipal
export const post = async (event) => {
    const body = await event.request.json();
    body.createdOn = new Date().getTime();
    const users = await db('users').insert(body);
    body.id = token[0];
    return {
        body: body
    }
}