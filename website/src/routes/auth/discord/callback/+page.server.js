import { tokenExchange, whoami as _whoami, getRedirectUri } from '$lib/discord-api';
import { v4 as uuidv4 } from "uuid";
import * as SessionModel from '@voxar/mongodb/models/session';
import * as UserModel from '@voxar/mongodb/models/user';

export async function load(event) {
    const { locals, url, cookies } = event;

    if (locals.session) return { error: "user_error", error_description: "Already logged in." }

    const code = url.searchParams.get("code");
    if (!code) return { error: "oauth2_error", error_description: "Discord did not provide a token." }

    const redirectUri = getRedirectUri(event);
    const token = await tokenExchange(code, redirectUri);
    if (!token?.access_token) return { error: "request_error", error_description: "Token exchange failed." }

    const whoami = await _whoami(token.access_token);
    if (!whoami) return { error: "token_error", error_description: "Request failed when trying to access user information." }

    const session = await SessionModel.create({
        id: uuidv4(),
        discord_user: whoami.user.id,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        valid_until: new Date(Date.now() + token.expires_in * 1000)
    });

    const user_data = (await UserModel.findById(whoami.user.id)) ?? (await UserModel.create({
        id: whoami.user.id
    }));

    const safeUserData = user_data.toObject();

    cookies.set('session', session.id, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: !(["localhost", "127.0.0.1"]).includes(url.hostname),
        maxAge: 60 * 60 * 24 * 7
    });

    return {
        user: whoami.user,
        session_id: session.id,
        user_data: {
            id: safeUserData.id,
            linkedAccounts: safeUserData.linkedAccounts.map(rA => ({
                id: rA.id,
                username: rA.username
            }))
        }
    };
}