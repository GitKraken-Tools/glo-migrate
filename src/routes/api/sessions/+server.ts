import { getCookie } from "$lib/cookies";
import { gk } from "$lib/gitkraken";
import { create, find } from "$lib/supabase";
import { Tables, TokenType, type Session, type Token } from "$lib/types";
import type { Card } from "@axosoft/glo-sdk/dist/v1_types";
import { error, json, type RequestEvent } from "@sveltejs/kit";

export interface NewSessionPayload {
    gitkrakenBoardId: string;
}

export const POST = async (event: RequestEvent) => {
    
    const cookies = event.request.headers.get('cookie') || '';
    const gitkrakenId = getCookie(cookies, 'gitkrakenId');
    if (!gitkrakenId) { throw error(403); }

    const data = await event.request.json() as NewSessionPayload;
    if (!data) { throw error(500); }

    const tokens = await find(Tables.TOKENS, 'gitkrakenId', gitkrakenId);
    const gitkrakenToken = tokens.map(i => i as Token).find(i => i.type === TokenType.GITKRAKEN)?.token;
    if (!gitkrakenToken) { throw error(500); }

    const board = await gk(gitkrakenToken).board(data.gitkrakenBoardId);
    const cards = await gk(gitkrakenToken).cards(data.gitkrakenBoardId);

    const gitkrakenBoardMemberIds = cards.map(i => i.created_by?.id).filter((element, index, array) => array.indexOf(element) === index);
    
    const session = await create(Tables.SESSIONS, {
        gitkrakenBoardId: data.gitkrakenBoardId,
        gitkrakenBoardName: board.name,
        gitkrakenBoardMemberIds,
        createdBy: gitkrakenId
    } as Session)

    console.log('working', gitkrakenId, session);
    return json(session)
}