import { gk } from '$lib/gitkraken';
import { TokenType, type Token } from '$lib/types';
import type { PageServerLoadEvent } from './$types';

export const load = async (event: PageServerLoadEvent) => {

    const parent = await event.parent();

    const gitkrakenToken = parent.tokens.map(i => i as Token).find(i => i.type === TokenType.GITKRAKEN)?.token;
    if (!gitkrakenToken) { return }

    const boards = await gk(gitkrakenToken).boards();

    return {
        boards
    }
}