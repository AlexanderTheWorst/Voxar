import { redirect } from '@sveltejs/kit';
import * as SessionModel from '$lib/prisma/models/session.js';

export async function GET(event) {
    const { cookies } = event;

    if (!cookies.get('session')) throw redirect(307, '/');
    try {
        await SessionModel.remove(cookies.get('session'));
    } catch(err) {
        console.warn(err);
    }
    cookies.delete('session', { path: '/' });

    throw redirect(307, '/');
}