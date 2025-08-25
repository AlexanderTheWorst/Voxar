import { tokenExchange, whoami as _whoami, getRedirectUri } from '$lib/discord-api';
import { v4 as uuidv4 } from "uuid";
import { redirect } from '@sveltejs/kit';
import * as SessionModel from '@voxar/mongodb/models/session';
import * as UserModel from '@voxar/mongodb/models/user';

export async function GET(event) {
    const { locals, url, cookies } = event;

    if (locals.session) throw redirect(307, '/dashboard');

    const code = url.searchParams.get("code");
    if (!code) throw redirect(307, "/auth/discord/login");

    const redirectUri = getRedirectUri(event);
    const token = await tokenExchange(code, redirectUri);
    if (!token?.access_token) throw redirect(307, "/auth/discord/login");

    const whoami = await _whoami(token.access_token);
    if (!whoami) throw redirect(307, "/auth/discord/login");

    const session = await SessionModel.create({
        id: uuidv4(),
        discord_user: whoami.user.id,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        valid_until: new Date(Date.now() + token.expires_in * 1000)
    });

    cookies.set('session', session.id, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: !(["localhost", "127.0.0.1"]).includes(url.hostname),
        maxAge: 60 * 60 * 24 * 7
    });

    throw redirect(307, '/dashboard');
}