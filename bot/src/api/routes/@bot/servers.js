import { client } from "../../../client.js";
import { DiscordPermissions, getGuilds, hasPermission } from "../../../lib/discord-api.js";

export default async function routes(fastify) {
  // GET /@bot/servers/@me
  fastify.get('/servers', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { user } = request.locals; // OAuth2-authenticated user
    const userId = user.user.id;

    const results = [];
    for (const [guildId, guild] of client.guilds.cache) {
      try {
        const member = await guild.members.fetch(userId);
        results.push({
          id: guild.id,
          name: guild.name,
          permissions: member.permissions.bitfield.toString()
        });
      } catch (err) {
        // console.log(err);
        // return reply.code(404).send({ error: 'Member not part of guild.' });
      }
    }

    return results;
  });

  // GET /@bot/servers/:server_id
  fastify.get('/servers/:server_id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { server_id } = request.params;
    const { user } = request.locals; // OAuth2-authenticated user
    const userId = user.user.id;

    const guild = client.guilds.cache.find(g => g.id === server_id);
    if (!guild) {
      return reply.code(404).send({ error: 'Bot not part of guild.' });
    }

    let results;
    try {
      const member = await guild.members.fetch(userId);
      if (!hasPermission(member.permissions, DiscordPermissions.MANAGE_GUILD)) throw new Error("Invalid permissions");
      
      results = {
        name: guild.name,
        id: guild.id,
        ownerId: guild.ownerId,
        memberCount: guild.members.cache.filter(m => !m.user.bot).size,
        permissions: member.permissions.bitfield.toString(),

        members: guild.members.cache.filter((m) => !m.user.bot).map(m => ({ id: m.user.id, username: m.user.username })),
        roles: guild.roles.cache.filter(r => r.name !== "@everyone" && r.name !== "@here" && !r.managed).map(r => ({
          name: r.name,
          id: r.id,
          colors: {
            primary: r.colors.primaryColor ? parseInt(r.colors.primaryColor, 10).toString(16) : null,
            tertiary: r.colors.tertiaryColor ? parseInt(r.colors.tertiaryColor, 10).toString(16) : null,
            secondary: r.colors.secondaryColor ? parseInt(r.colors.secondaryColor, 10).toString(16) : null,
          }
        })),
        channels: guild.channels.cache.map(c => ({
          name: c.name,
          id: c.id
        }))
      };
    } catch (err) {
      console.log(err);
      return reply.code(404).send({ error: 'Member not part of guild.' });
    }
    // console.log(results);

    return results;
  });

  // POST /@bot/servers/:server_id/action
  fastify.post('/servers/:server_id/action', { preHandler: fastify.authenticate }, async (request) => {
    const { server_id } = request.params;
    const { action } = request.body;
    return { server_id, action, status: 'executed', user: request.user };
  });
}