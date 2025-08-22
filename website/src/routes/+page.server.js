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

  // Expose only safe user fields to frontend
  return {
    user,
    guilds
  };
}
