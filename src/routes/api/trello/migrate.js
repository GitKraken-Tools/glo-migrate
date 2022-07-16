import { gk } from '$lib/gitkraken';
import { trello } from '$lib/trello';

export const post = async (event) => {
    
    const session = await event.request.json();
    const creator = session.gitkrakenBoardUsers.find(i => i.gitkrakenId = session.createdBy);

    const gitkrakenBoard = await gk(creator.tokens.find(i => i.type === 'GitKraken').token).board(session.gitkrakenBoardId);
    const gitkrakenCards = await gk(creator.tokens.find(i => i.type === 'GitKraken').token).cards(session.gitkrakenBoardId);
    
    const trelloBoard = await trello(creator).board(session.gitkrakenBoardName);

    let trelloLists = [];
    for (const list of gitkrakenBoard.columns.reverse()) {
        trelloLists.push(await trello(creator).list(trelloBoard.id, list.name).then(i => {
            i.gitkrakenListId = list.id;
            return i;
        }));
    }

    let trelloLabels = [];
    for (const label of gitkrakenBoard.labels.reverse()) {
        // TODO: add color. Color is RGB but Trello only supports string names.
        // yellow, purple, blue, red, green, orange, black, sky, pink, lime
        trelloLabels.push(await trello(creator).label(trelloBoard.id, label.name, 'red').then(i => {
            i.gitkrakenLabelId = label.id;
            return i;
        }));
    }

    // Given a GitKraken user ID, return who made the item, otherwise default to creator (admin).
    const getItemCreator = (id) => {
        return session.gitkrakenBoardUsers.find(i => i.gitkrakenId = id) || creator;
    }

    // Given a GK list ID, find the Trello list ID counterpart.
    const getTrelloListId = (gitrakenListId) => {
        return trelloLists.find(i => i.gitkrakenListId === gitrakenListId).id;
    }

    // Given a GK label ID, find the Trello label ID counterpart.
    const getTrelloLabelId = (gitrakenLabelId) => {
        return trelloLabels.find(i => i.gitkrakenLabelId === gitrakenLabelId).id;
    }

    // TODO: trello supports "customFields" - Use this for milestones?
    // https://developer.atlassian.com/cloud/trello/rest/api-group-customfields/#api-group-customfields

    let trelloCards = [];
    for (const card of gitkrakenCards) { // This should not be reverse
        const CREATOR = getItemCreator(card.created_by.id);
        const labelIds = card.labels.map(i => getTrelloLabelId(i.id));
        const listId = getTrelloListId(card.column_id);
        const desc = card.description?.text?.split('\n') // The card description has a separate created by field.
            .filter(i => !i.startsWith('- [ ] ') && !i.startsWith('- [x] ')) // Filter out checklists
            .join('\n'); 
        trelloCards.push(await trello(CREATOR).card(
            listId,
            card.name,
            desc,
            card.due_date,
            null,
            labelIds
        ).then(i => {
            i.gitkrakenCardId = card.id;
            return i;
        }));
    }

    // Given a GK card ID, find the Trello card ID counterpart.
    const getTrelloCardId = (gitkrakenCardId) => {
        return trelloCards.find(i => i.gitkrakenCardId === gitkrakenCardId).id;
    }

    for (const card of gitkrakenCards) {
        const checkItems = card.description?.text?.split('\n')
            .filter(i => i.startsWith('- [ ] ') || i.startsWith('- [x] '))
            .map(i => { 
                const checked = i.startsWith('- [x] ');
                return {
                    name: i.substring(6),
                    checked
                }
            });
        if (checkItems) {
            const trelloChecklist = await trello(getItemCreator(card.created_by.id)).checklist(getTrelloCardId(card.id));
            for (const checkItem of checkItems) {
                // Tasks cannot be assigned to users or due dates with the free workspace.
                await trello(getItemCreator(card.created_by.id)).checkitem(trelloChecklist.id, checkItem.name, checkItem.checked);
            }
        }
    }

    

    console.log('CARDS', trelloCards);

    // console.log('TRELLO BOARD', trelloBoard);
    // console.log('should migrate', session);
    console.log('GK Cards', gitkrakenCards);
    console.log('GK Users', session.gitkrakenBoardUsers);
    
    return {}
}