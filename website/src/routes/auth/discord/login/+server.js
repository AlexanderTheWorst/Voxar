import { getOAuth2Link } from '$lib/discord-api.js';
import { redirect } from '@sveltejs/kit';

export async function GET(event) {
    const { locals } = event;
    const { session, user } = locals;

    if (session && user) throw redirect(307, '/dashboard');

    const oauth2Link = getOAuth2Link(event);
    throw redirect(307, oauth2Link);
}