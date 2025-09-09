import { getOAuth2Link } from '$lib/roblox-api.js';
import { redirect } from '@sveltejs/kit';

export async function GET(request) {
    throw redirect(307, getOAuth2Link(request));
}