import { gk } from '$lib/gitkraken';
import { select, contains, find } from '$lib/supabase';
import { trello } from '$lib/trello';
import { type Token, Tables, type Profile, type Session, TokenType, type TrelloToken, type GitkrakenToken } from '$lib/types';
import type { Board, Card, Column, Comment, Label } from '@axosoft/glo-sdk/dist/v1_types';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export const POST = async (event: RequestEvent) => {

    // TODO: trello supports "customFields" - Use this for milestones?
    // https://developer.atlassian.com/cloud/trello/rest/api-group-customfields/#api-group-customfields

    const sessionId = event.url.searchParams.get('sessionId');
    if (!sessionId) { throw error(500); }
    
    const session: Session = await find(Tables.SESSIONS, 'id', sessionId).then(i => i[0] as Session);
    const tokens: Token[] = await select(Tables.TOKENS).then(i => i.map(j => j as Token));

    // Given a GitKraken user ID, return the Trello token
    const trelloToken = (gitkrakenId: string) => {
        // First try to get the owner
        let token = tokens.find(i => i.gitkrakenId === gitkrakenId && i.type === TokenType.TRELLO);
        // Otherwise default to creator
        if (!token) { token = tokens.find(i => i.gitkrakenId === session.createdBy && i.type === TokenType.TRELLO); }
        // Else fail
        if (!token) { throw error(500); }
        return JSON.parse(token.token as string) as TrelloToken;
    }

    // Given a GitKraken user ID, return the Trello token
    const gitkrakenToken = (gitkrakenId: string) => {
        return tokens.find(i => i.gitkrakenId === session.createdBy && i.type === TokenType.GITKRAKEN)?.token as GitkrakenToken;
    }

    // Iterate over a list of gitkraken items and create them on the other side one-after-another
    const createSynchronously = async (items: any[], trelloCall: Function): Promise<any[]> => {
        let response: any[] = [];
        items = items.reverse();
        for(const item of items) {
            await trelloCall(item).then((i: any) => {i.gitkrakenCounterpartId = item.id; return i; }).then((i: any) => response.push(i));
        }
        return response;
    }
    
    // Get the creator's tokens for ease of use
    const creatorGitkrakenToken = gitkrakenToken(session.createdBy);
    const creatorTrelloToken = trelloToken(session.createdBy);

    // Fetch the board and cards in question
    const gitkrakenBoard: Board = await gk(creatorGitkrakenToken).board(session.gitkrakenBoardId);
    const gitkrakenCards: Card[] = await gk(creatorGitkrakenToken).cards(session.gitkrakenBoardId);

    if (!gitkrakenBoard || !gitkrakenBoard.columns) { throw error(500); }
    
    // Create the board on Trello
    const trelloBoard: any = await trello(session.createdBy, creatorTrelloToken).board(session.gitkrakenBoardName);

    const trelloLists = await createSynchronously(
        gitkrakenBoard.columns || [],
        (item: Column) => trello(session.createdBy, creatorTrelloToken).list(trelloBoard.id, item.name || 'Untitled')
    );

    // TODO: add color. Color is RGB but Trello only supports string names.
    // yellow, purple, blue, red, green, orange, black, sky, pink, lime
    const trelloLabels = await createSynchronously(
        gitkrakenBoard.labels || [],
        (item: Label) => trello(session.createdBy, creatorTrelloToken).label(trelloBoard.id, item.name || 'Undefined', 'red')
    );

    // // Given a GK list ID, find the Trello counterpart ID.
    const getTrelloCounterpart = (gitrakenId: string, items: any[]) => {
        return items.find((i: any) => i.gitkrakenCounterpartId === gitrakenId).id;
    }

    const addCardDetails = async (card: any, cardTrelloToken: TrelloToken) => {
        if (!card) { return }

        console.log('adding comments');
        // ADD COMMENTS
        const gitkrakenComments = await gk(creatorGitkrakenToken).comments(session.gitkrakenBoardId, card.id);
        console.log('gitkraken comments', gitkrakenComments);
        const trelloComments = await createSynchronously(
            gitkrakenComments || [],
            (item: Comment) => {
                if (!item.created_by || !item.text || !card.id) { return }
                const commentTrelloToken = trelloToken(item.created_by.id);
                return trello(item.created_by.id, commentTrelloToken).comment(card.id, item.text)
            }
        );

        // ADD ATTACHMENTS
        // if (card.attachment_count > 0) {
            // const gitkrakenAttachments = await gk(creator).attachments(session.gitkrakenBoardId, card.id);
            // for (const attachment of gitkrakenAttachments) {
            //     await trello(getItemCreator(attachment.created_by.id)).attachment(getTrelloCardId(card.id), attachment.name, attachment.url);
            // }
        // }

        // CREATE CHECKLIST
        const checkItems = card.description?.text?.split('\n')
            .filter((i: string) => i.startsWith('- [ ] ') || i.startsWith('- [x] '))
            .map((i: string) => { 
                const checked = i.startsWith('- [x] ');
                return {
                    name: i.substring(6),
                    checked
                }
            });
            console.log('check items', checkItems);
        if (checkItems) {
            console.log('creating checklist');
            const trelloChecklist: any = await trello(card.created_by.id, cardTrelloToken).checklist(card.id);
            console.log('created', trelloChecklist);
            // for (const checkItem of checkItems) {
            //     // Tasks cannot be assigned to users or due dates with the free workspace.
            //     await trello(card.created_by.id, cardTrelloToken).checkitem(trelloChecklist.id, checkItem.name, checkItem.checked);
            // }
        }

        return card;
        
    }

    await Promise.all(
        gitkrakenCards.map(card => {
            if (!card.column_id || !card.created_by) { return }
            const cardTrelloToken = trelloToken(card.created_by.id);
            const labelIds = card.labels?.map(i => getTrelloCounterpart(i.id, trelloLabels)) || [];
            const listId = getTrelloCounterpart(card.column_id, trelloLists);
            const desc = card.description?.text?.split('\n') // The card description has a separate created by field.
                .filter(i => !i.startsWith('- [ ] ') && !i.startsWith('- [x] ')) // Filter out checklists
                .join('\n') || ''; 
            return trello(card.created_by.id, cardTrelloToken).card(
                listId,
                card?.name || 'Untitled',
                desc,
                card.due_date || '',
                [],
                labelIds
            ).then((i: any) => {
                i.gitkrakenCounterpartId = card.id;
                return i;
            }).then(i => addCardDetails(i, cardTrelloToken));
        })
    )
    
    return json({});
}