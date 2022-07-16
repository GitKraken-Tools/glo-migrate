import { gk } from '$lib/gitkraken';

export const get = async (event) => {
    const boards = await gk(event.locals).boards();
    return {
        body: {
            boards
        }
    }
}