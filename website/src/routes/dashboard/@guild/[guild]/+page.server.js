import { redirect } from "@sveltejs/kit";
import { findById } from "@voxar/mongodb/models/session";
import GuildModel from "@voxar/mongodb/models/guild"
import { ModuleManager } from "@voxar/shared";

export async function load({ params, locals, cookies, route }) {
    let { guild } = params;
    let { user, user_data, session: sessionId = undefined } = locals;

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

    let modules = (async () => {
        let modules = [];
        for (let module of ModuleManager.all(guild)) {
            modules.push(await module.hydrate());
        }
        let data = await Promise.all(modules)
        return data;
    })();

    return {
        guild: guild_data,
        user: user.user,
        user_data,
        modules
        
        // modules: ModuleManager.all(guild).map((m) => {

        // })
    };
}