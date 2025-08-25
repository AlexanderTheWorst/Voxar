import { whoami, getGuilds, hasPermission, DiscordPermissions } from '$lib/discord-api.js';
import { findById, remove, create } from "@voxar/mongodb/models/session";
import { isRedirect } from '@sveltejs/kit';

export async function load({ cookies, locals }) {
  const { user, session, user_data } = locals;

  const authorizedUser = await findById(session); // I already know it exists otherwise it wouldn't pass through.

  // Fetch Discord user info and guilds with access token
  let guilds = await getGuilds(authorizedUser.access_token);
  if (guilds) guilds = guilds.filter(g => hasPermission(g.permissions, DiscordPermissions.MANAGE_GUILD));

  // Fetch mutual servers
  const response = await fetch(`http://${process.env.DOCKER ? "bot:3000" : "localhost:3000"}/@bot/servers`, {
    headers: {
      "Authorization": authorizedUser.access_token
    }
  });

  let mutuals;
  if (!response.ok) console.warn(await response.text()); // optional debugging
  else mutuals = await response.json();

  const safeUserData = user_data ? user_data.toObject() : null;

  // Expose only safe user fields to frontend
  return {
    user: user.user,
    user_data: {
      id: safeUserData.id,
      linkedAccounts: safeUserData.linkedAccounts.map(g => ({
        id: g.id,
        username: g.username
      }))
    },
    guilds,
    mutuals: (mutuals ?? [])
  };
}
