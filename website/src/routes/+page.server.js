import { whoami, getGuilds } from '$lib/discord-api.js';
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
  const guilds = await getGuilds(session.access_token);

  // Expose only safe user fields to frontend
  return {
    user,
    guilds
  };
}
