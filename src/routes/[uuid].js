import {db} from "$lib/db";

export const get = async (event) => {
    const sessionUUID = event.params.uuid;
    const sessions = await db('sessions').select('*').where('uuid', sessionUUID);
    if (sessions.length === 0) {
        return Response.redirect(`http://${event.url.host}/`, 302)
    }

    for (let i = 0; i < sessions.length; i++) {
        const users = await Promise.allSettled(
            JSON.parse(sessions[i].gitkrakenBoardUsers).map(j => {
                return db('users').select('*').where('gitkrakenId', j);
            })
        );
        sessions[i].gitkrakenBoardUsers = JSON.parse(sessions[i].gitkrakenBoardUsers).map((j, index) => {
            return users[index].value[0] ? users[index].value.map(k => {
                k.tokens = JSON.parse(k.tokens);
                return k;
            })[0] : {gitkrakenId: j}
        });
    }

    return {
        body: {
            session: sessions[0]
        }
    }
}