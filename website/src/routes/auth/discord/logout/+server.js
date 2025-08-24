import { redirect } from '@sveltejs/kit';
import { findById, remove } from '$lib/server/models/session';

export async function GET({ cookies, locals }) {
    const { session } = locals;

    try {
        await remove(session);
    } catch(err) {
        console.warn(err);
    }
    cookies.delete('session', { path: '/' });

    throw redirect(307, '/');
}