import { v4 as uuidv4 } from 'uuid';
import db, { init } from '$lib/db';
import GloSDK from '@axosoft/glo-sdk';

const getStep = (session) => {
    console.log(session);
    if (session.users.length >= 1 && !session.boardId) { return 1 }
    if (session.users.length >= 1 && session.boardId) { return 2 }
    return 0;
}

// Init and return a session
export const get = async (request) => {
    await init(db);
    const uuid = request.params.uuid;
    if (!uuid) { return { status: 400 } }
    let session = await db('sessions').where('uuid', uuid);
    if (session.length !== 1) { return { status: 400 } }
    session = session[0];
    session.users = JSON.parse(session.users);
    session.step = getStep(session);
    return {
        body: session
    }
}

// Add the boardId to the session
export const put = async (request) => {
    const uuid = request.params.uuid;
    const boardId = request.body.boardId;
    let session = await db('sessions').where('uuid', uuid);
    if (!boardId || session.length !== 1) { return { status: 400 } }
    session = session[0];
    session.boardId = boardId;
    let update = await db('sessions').where('uuid', uuid).update(session);
    return {
        body: {}
    }
}

// Add a user's token to a session
export const post = async (request) => {
    const uuid = request.params.uuid;
    const { token, type } = request.body;
    let session = await db('sessions').where('uuid', uuid);
    if (!uuid || !token || !type || session.length !== 1) { return { status: 400 } }
    session = session[0];
    session.users = JSON.parse(session.users);
    switch (type) {
        case 'Glo':
            let user = await GloSDK(token).users.getCurrentUser();
            user.token = token;
            session.users.push(user);
            break;
        case 'Trello':
            const { gloId } = request.body;
            if (!gloId) { return { status: 400 } }
            console.log(uuid, token, type, gloId);
            let gloUser = session.users.find(i => i.id === gloId);
            gloUser['Trello'] = token;
            break;
    }
    session.users = JSON.stringify(session.users);
    let update = await db('sessions').where('uuid', uuid).update(session);

    return {
        body: { token, type }
    }
}