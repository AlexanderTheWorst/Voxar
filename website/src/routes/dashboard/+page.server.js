import { whoami, getGuilds, hasPermission, DiscordPermissions } from '$lib/discord-api.js';
import { findById, remove, create } from "@voxar/mongodb/models/session";
import { isRedirect } from '@sveltejs/kit';

// export async function load({ cookies, locals }) {
//   const { user, session, user_data } = locals;

//   const authorizedUser = await findById(session); // I already know it exists otherwise it wouldn't pass through.

//   // Fetch Discord user info and guilds with access token
//   let guilds = await getGuilds(authorizedUser.access_token);
//   if (guilds) guilds = guilds.filter(g => hasPermission(g.permissions, DiscordPermissions.MANAGE_GUILD));

//   // Fetch mutual servers
//   const response = await fetch(`http://${process.env.DOCKER ? "bot:3000" : "localhost:3000"}/@bot/servers`, {
//     headers: {
//       "Authorization": authorizedUser.access_token
//     }
//   });

//   let mutuals;
//   if (!response.ok) console.warn(await response.text()); // optional debugging
//   else mutuals = await response.json();

//   // Expose only safe user fields to frontend
//   return {
//     user: user.user,
//     user_data,
//     guilds: guilds.map(g => ({...g, botInServer: (mutuals ?? []).find(m => m.id === g.id) })),
//     mutuals: (mutuals ?? [])
//   };
// }

export async function load({ locals }) {
    const { user, session, user_data } = locals;
    const authorizedUser = await findById(session);

    const guildsPromise = (async () => {
        let guilds = (await getGuilds(authorizedUser.access_token) ?? []);
        let mutuals = [];
        if (guilds) guilds = guilds.filter(g => hasPermission(g.permissions, DiscordPermissions.MANAGE_GUILD));

        const response = await fetch(`http://${process.env.DOCKER ? "bot:3000" : "localhost:3000"}/@bot/servers`, {
            headers: { Authorization: authorizedUser.access_token }
        });
        if (response.ok) mutuals = await response.json();

        return guilds.map(g => ({
            ...g,
            botPerspective: mutuals.find(m => m.id === g.id),
            botInServer: mutuals.find(m => m.id === g.id)
        }));
    })();

    return {
        user: user.user,
        user_data,
        guilds: guildsPromise
    };
}