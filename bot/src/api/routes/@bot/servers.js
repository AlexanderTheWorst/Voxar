import { client } from "../../../client.js";
import { getGuilds } from "../../../lib/discord-api.js";

export default async function routes(fastify) {
  // GET /@bot/servers/@me
  fastify.get('/servers', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { user } = request.locals; // OAuth2-authenticated user
    const userId = user.user.id;

    // console.log(request.locals, userId);
  
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

    // console.log(results);

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
      results = {
        name: guild.name,
        id: guild.id,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        permissions: member.permissions.bitfield.toString()
      };
    } catch (err) {
      console.log(err);
      return reply.code(404).send({ error: 'Member not part of guild.' });
    }
    console.log(results);

    return results;
  });

  // POST /@bot/servers/:server_id/action
  fastify.post('/servers/:server_id/action', { preHandler: fastify.authenticate }, async (request) => {
    const { server_id } = request.params;
    const { action } = request.body;
    return { server_id, action, status: 'executed', user: request.user };
  });
}