import { getCookie } from '$lib/cookies';
import {db} from "$lib/db";

export const getSession = async (event) => {
    return event.locals
}

export const handle = async ({ event, resolve }) => {
    const cookies = event.request.headers.get('cookie');
    const gitKrakenId = getCookie(cookies, 'gitKrakenId');
    let profile = null;
  
    if (event.url.pathname.indexOf('/login') === -1 && event.url.pathname.indexOf('/api') === -1) {
        if (!gitKrakenId) {
            return Response.redirect(`http://${event.url.host}/login`, 302)
        }
        // Fetch data if the user does not currently have the data in their session
        profile = await db('users').select('*').where('gitKrakenId', gitKrakenId);
        // Redirect to logout if the user is not authenticated
        if (profile.length === 0) {
            console.log('DEBUG: Got gitKrakenId but failed to fetch associated user.')
            return Response.redirect(`http://${event.url.host}/login`, 302)
        }
    }

    if (profile && profile.length !== 0) {
        // Set the session
        event.locals = profile.map(i => { 
            i.tokens = JSON.parse(i.tokens); 
            return i;
        })[0]
    }
  
    const response = await resolve(event)
    return response
  }