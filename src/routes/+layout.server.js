import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export const load = (event) => {
    console.log('loaded layout', event.request.headers.get('cookie'));

    if (event.url.pathname !== '/login') {
        // throw redirect(307, '/login');
    }    

    return {
        test: true
    }
}