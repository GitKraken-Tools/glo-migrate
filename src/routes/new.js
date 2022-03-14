import { gk } from '$lib/gitkraken';

export const get = async (event) => {
    const gitKrakenToken = event.locals.tokens.find(i => i.type === 'GitKraken').token;
    const boards = await gk(gitKrakenToken).boards();
    return {
        body: {
            boards
        }
    }
}