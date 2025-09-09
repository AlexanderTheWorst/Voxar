import { getOAuth2Link } from '$lib/discord-api.js';
import { redirect, error } from '@sveltejs/kit';
import { findById } from '@voxar/mongodb/models/session.js';

let botURI = `http://${process.env.NODE_ENV == "production" ? "bot:3000" : "localhost:3000"}`;

async function fetchSessionData(sessionId) {
    let response = await fetch(`${botURI}/@verify/${sessionId}`);
    if (!response.ok) return;
    let json = await response.json();
    return json;
}

async function getGuildInfo(guildId, token) {
    let response = await fetch(`${botURI}/@bot/servers/${guildId}`, {
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": token
        })
    });
    if (!response.ok) return;
    let json = await response.json();
    return json;
}

export async function load(request) {
    const { params, locals } = request;
    const { user, user_data, session } = locals;
    const { SessionId } = params;

    let tokenData = await findById(session);

    if (!user && !session)
        throw redirect(307, getOAuth2Link(request, `/verify/${SessionId}`));

    let sessionData = await fetchSessionData(SessionId);
    if (!sessionData) throw new error(404, { message: "Invalid session." });

    let guildData = await getGuildInfo(sessionData.guildId, tokenData.access_token);
    if (!guildData) throw new error(404, { message: "Invalid session." });

    if (sessionData.userId !== user.user.id) throw new error(404, { message: "Wrong account, missmatching users." });

    return {
        user: user.user,
        user_data,
        guild: guildData,
        session: sessionData
    }
}