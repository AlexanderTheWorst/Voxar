import { redirect } from "@sveltejs/kit";
import { findById } from "@voxar/mongodb/models/session";

export async function load({ params, locals, cookies, route }) {
    let { guild } = params;
    let { user, user_data } = locals;

    const sessionId = cookies.get("session");
    if (!sessionId) {
        return { user: null };
    }

    const session = await findById(sessionId);
    if (!session) {
        return { user: null };
    }

    const guildResponse = await fetch(`http://${process.env.NODE_ENV == "production" ? "bot:3000" : "localhost:3000"}/@bot/servers/${guild}`, {
        headers: new Headers({
            "Authorization": session.access_token
        })
    })

    if (!guildResponse.ok) {
        throw redirect(307, "/dashboard");
    }

    const guild_data = await guildResponse.json();

    return {
        guild: guild_data,
        user: user.user,
        user_data
    };
}