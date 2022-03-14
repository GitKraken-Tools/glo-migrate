import GloSDK from "@axosoft/glo-sdk";

export const gk = (token) => {
    return {
        boards: () => GloSDK(token).boards.getAll({
            fields: ["name", "labels", "columns", "archived_columns"],
        }),
        board: (boardId) => GloSDK(token).boards.get(boardId, {
            fields: ["name", "labels", "columns", "archived_columns"],
        }),
        cards: (boardId) => GloSDK(token).boards.cards.getAll( boardId, {
            fields: [
                "archived_date", "assignees", "attachment_count", "column_id", "comment_count", "created_by", "created_date", "due_date", "description", "labels", "name", "total_task_count", "milestone", "is_divider",
            ],
        }),
        user: () => GloSDK(token).users.getCurrentUser()
    }
}