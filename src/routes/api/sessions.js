import {db} from "$lib/db";
import { v4 as uuidv4 } from 'uuid';

// QUERY PARAMS - none
export const get = async () => {
    return {
        body: await db('sessions').select('*')
    }
}

// BODY - target
export const post = async (event) => {
    const body = await event.request.json();
    body.createdOn = new Date().getTime();
    body.uuid = uuidv4();
    const session = await db('sessions').insert(body);
    body.id = session[0];
    return {
        body: body
    }
}

// BODY - session
export const put = async (event) => {
    const body = await event.request.json();
    const session = await db('sessions').update(body).where('uuid', body.uuid);
    return {
        body: body
    }
}