import { v4 as uuidv4 } from 'uuid';
import db, { init } from '$lib/db';

export const get = async (request) => {
    await init(db);
    const uuid = request.params.uuid;
    if (!uuid) { return { status: 400 } }
    const session = await db('sessions').where('uuid', uuid);
    if (session.length !== 1) { return { status: 400 } }
    return {
        body: session[0]
    }
}