import { whoami, getGuilds, hasPermission, DiscordPermissions } from '$lib/discord-api.js';
import * as SessionModel from "$lib/prisma/models/session.js";

export async function load({ cookies }) {
  const sessionId = cookies.get("session");
  if (!sessionId) {
    return { user: null };
  }

  const session = await SessionModel.findById(sessionId);
  if (!session) {
    return { user: null };
  }

  // Fetch Discord user info and guilds with access token
  const { user } = await whoami(session.access_token);
  let guilds = await getGuilds(session.access_token);
  if (guilds) guilds = guilds.filter(g => hasPermission(g.permissions, DiscordPermissions.MANAGE_GUILD));

  // Fetch mutual servers
  const response = await fetch(`http://${process.env.DOCKER ? "bot:3000" : "localhost:3000"}/@bot/servers`, {
    headers: {
      "Authorization": session.access_token
    }
  });

  let mutuals;
  if (!response.ok) console.warn(await response.text()); // optional debugging
  else mutuals = await response.json();

  // Expose only safe user fields to frontend
  return {
    user,
    guilds,
    mutuals: (mutuals ?? [])
  };
}
