import { get as sessions} from './api/sessions';
import GloSDK from "@axosoft/glo-sdk";

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}

export const get = async (event) => {
    const session = await (await sessions().then(i => i.body)).find(i => i.uuid === event.params.uuid);
    
    const users = await fetch(`http://${event.url.host}/api/users?sessionId=${session.uuid}`).then(i => i.json()).then(i => i.map(j => {
        j.sourcePrincipal = JSON.parse(j.sourcePrincipal);
        j.targetPrincipal = JSON.parse(j.targetPrincipal);
        return j;
    }));

    let boards = [];
    let cards = [];
    let userIds = [];

    if (users.length > 0) {
        boards = await GloSDK(users[0].sourceToken).boards.getAll({
            fields: ["name", "labels", "columns", "archived_columns"],
        });
    }

    if (session.sourceId) {
        cards = await GloSDK(users[0].sourceToken).boards.cards.getAll(
            session.sourceId,
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
    }

    if (cards.length > 0) {
        userIds = cards.flatMap(i => i.created_by.id).filter(onlyUnique);
    }

    let stepIndex = 0;
    if (users.length > 0) { stepIndex = 1; }
    if (session.sourceId) { stepIndex = 2; }
    return {
        body: {
            session,
            users,
            stepIndex,
            boards,
            cards,
            userIds
        }
    }
}