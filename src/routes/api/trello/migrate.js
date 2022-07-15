import { gk } from '$lib/gitkraken';
import { trello } from '$lib/trello';

export const post = async (event) => {
    const session = await event.request.json();
    const creator = session.gitkrakenBoardUsers.find(i => i.gitkrakenId = session.createdBy);

    const gitkrakenBoard = await gk(creator.tokens.find(i => i.type === 'GitKraken').token).board(session.gitkrakenBoardId);
    const gitkrakenCards = await gk(creator.tokens.find(i => i.type === 'GitKraken').token).cards(session.gitkrakenBoardId);

    
    const trelloBoard = await trello(creator).board(session.gitkrakenBoardName);

    for (const list of gitkrakenBoard.columns.reverse()) {
        await trello(creator).list(trelloBoard.id, list.name);
    }

    console.log('LISTS', lists);
    const trelloLists = await Promise.all(lists).then(i => console.log(i));

    // console.log('TRELLO BOARD', trelloBoard);
    // console.log('should migrate', session);
    // console.log('board', gitkrakenBoard, gitkrakenCards);
    
    return {}
}