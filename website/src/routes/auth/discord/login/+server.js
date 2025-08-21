import { getOAuth2Link } from '$lib/discord-api.js';
import { redirect } from '@sveltejs/kit';

export async function GET(event) {
    const { cookies } = event;

    if (cookies.get('session')) throw redirect(307, '/');

    const oauth2Link = getOAuth2Link(event);
    throw redirect(307, oauth2Link);
}