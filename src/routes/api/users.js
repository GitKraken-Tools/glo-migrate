import {db} from "$lib/db";

export const get = async (event) => {
    return {
        body: await db('users').select('*').where('sessionId', event.url.searchParams.get('sessionId'))
    }
}

export const post = async (event) => {
    const body = await event.request.json();
    body.createdOn = new Date().getTime();
    const users = await db('users').insert(body);
    body.id = token[0];
    return {
        body: body
    }
}