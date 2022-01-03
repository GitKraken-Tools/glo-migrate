import { v4 as uuidv4 } from 'uuid';
import db, { init } from '$lib/db';

export const post = async (request) => {
    const target = request.url.searchParams.get('target');
    const newUuid = uuidv4();
    if (!target) { return { status: 400 } }
    await init(db);
    await db('sessions').insert({
        uuid: newUuid,
        target: 'Trello',
        users: '',
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
    });
    return {
        body: {
            uuid: newUuid
        }
    }
}