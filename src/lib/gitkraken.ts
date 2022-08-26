import GloSDK from "@axosoft/glo-sdk";

export const gk = (token?: string) => {
    return {
        boards: () => GloSDK(token || '').boards.getAll({
            fields: ["name", "labels", "columns", "archived_columns"],
        }),
        board: (boardId: string) => GloSDK(token || '').boards.get(boardId, {
            fields: ["name", "labels", "columns", "archived_columns"],
        }),
        cards: (boardId: string) => GloSDK(token || '').boards.cards.getAll( boardId, {
            fields: [
                "archived_date", "assignees", "attachment_count", "column_id", "comment_count", "created_by", "created_date", "due_date", "description", "labels", "name", "total_task_count",
            ],
            archived: false,
            sort: 'desc'
        }),
        comments: (boardId: string, cardId: string) => GloSDK(token || '').boards.cards.comments.get(boardId, cardId, {
            fields: [
                "created_by", "updated_by", "text",
            ],
            sort: 'desc'
        }),
        user: () => GloSDK(token || '').users.getCurrentUser(),
        token: (code: string) => fetch('https://api.gitkraken.com/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "grant_type": "authorization_code",
                "client_id": import.meta.env.VITE_GITKRAKEN_CLIENT_ID,
                "client_secret": import.meta.env.VITE_GITKRAKEN_CLIENT_SECRET,
                code
            })
        }).then(i => i.json())
    }
}