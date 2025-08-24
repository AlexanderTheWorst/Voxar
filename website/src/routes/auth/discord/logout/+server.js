import { redirect } from '@sveltejs/kit';
import * as SessionModel from '$lib/prisma/models/session.js';

export async function GET({ cookies, locals }) {
    const { session } = locals;

    try {
        await SessionModel.remove(session);
    } catch(err) {
        console.warn(err);
    }
    cookies.delete('session', { path: '/' });

    throw redirect(307, '/');
}