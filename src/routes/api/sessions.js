import {db} from "$lib/db";
import { gk } from '$lib/gitkraken';
import { v4 as uuidv4 } from 'uuid';
import { getCookie } from '$lib/cookies';

// QUERY PARAMS - none
export const get = async () => {
    return {
        body: await db('sessions').select('*')
    }
}

// BODY - target
export const post = async (event) => {
    // console.log(event);
    const cookies = event.request.headers.get('cookie');
    const gitKrakenId = getCookie(cookies, 'gitKrakenId');
    const body = await event.request.json();
    body.createdOn = new Date().getTime();
    body.createdBy = gitKrakenId;
    body.uuid = uuidv4();

    const profile = await db('users').select('*').where('gitKrakenId', gitKrakenId).then(i => i[0]);
    if (profile) { profile.tokens = JSON.parse(profile.tokens); }

    const cards = await gk(profile).cards(body.gitkrakenBoardId);
    const users = cards.map(i => i.created_by.id).filter((element, index, array) => array.indexOf(element) === index);
    body.gitkrakenBoardUsers = JSON.stringify(users);

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