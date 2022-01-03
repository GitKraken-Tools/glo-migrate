import GloSDK from "@axosoft/glo-sdk";
import { writable } from 'svelte/store';

export const boards = writable([]);
export const cards = writable([]);
export const user = writable(null);

export const fetchBoards = async (token) => {
    const boards$ = await GloSDK(token).boards.getAll({
        fields: ["name", "labels", "columns", "archived_columns"],
    });
    boards.set(boards$)
}

export const fetchCards = async (token, boardId) => {
    const cards$ = await GloSDK(token).boards.cards.getAll(
        boardId,
        {
            fields: [
                "archived_date",
                "assignees",
                "attachment_count",
                "column_id",
                "comment_count",
                "created_by",
                "created_date",
                "due_date",
                "description",
                "labels",
                "name",
                "total_task_count",
                "milestone",
                "is_divider",
            ],
        }
    );
    cards.set(cards$);
}

export const fetchUser = async (token) => {
    const user$ = await GloSDK(token).users.getCurrentUser();
    user.set(user$);
}

export const mapData = (board, cards, users) => {
    console.log('map', board, cards, users);
    const cardsMap = cards.map(card => {
        const foundUser = users.find(user => card.created_by.id === user.id);
        if (foundUser) {
            card.created_by.username = foundUser.username;
        }
        return card;
    })

    board.columns.map(col => {
        col.cards = cardsMap.filter(card => card.column_id === col.id)
        return col;
    });

    return board
}