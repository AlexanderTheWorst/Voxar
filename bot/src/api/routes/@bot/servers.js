import { client } from "../../../client.js";
import { getGuilds } from "../../../lib/discord-api.js";

export default async function routes(fastify) {
  // GET /@bot/servers/@me
  fastify.get('/servers/@me', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { authorization } = request.headers;
    if (!authorization) {
      return reply.code(401).send({ error: 'Missing access token' });
    }

    // Fetch user guilds (cached)
    const userGuilds = await getGuilds(authorization);
    if (!userGuilds || !userGuilds.length) {
      return reply.code(404).send({ error: 'No accessible servers found' });
    }

    // Fetch bot guilds
    const botGuildsCollection = await client.guilds.fetch();
    const botGuilds = botGuildsCollection.map(g => ({
      id: g.id.toString(),
      name: g.name,
      permissions: g.permissions.toString(), // serialize BigInt
      features: g.features
    }));

    // Compute mutual guilds
    const mutualGuilds = botGuilds.filter(bg =>
      userGuilds.some(ug => ug.id === bg.id)
    );

    // Return safe data
    return mutualGuilds;
  });

  // GET /@bot/servers/:server_id
  fastify.get('/servers/:server_id', { preHandler: fastify.authenticate }, async (request, reply) => {
    const { server_id } = request.params;
    const { authorization } = request.headers;

    const userGuilds = await getGuildsCached(authorization);
    if (!userGuilds || !userGuilds.some(g => g.id === server_id)) {
      return reply.code(404).send({ error: 'Resource unavailable' });
    }

    const botGuildsCollection = await client.guilds.fetch();
    const guild = botGuildsCollection.map(g => ({
      id: g.id.toString(),
      name: g.name,
      permissions: g.permissions.toString(),
      features: g.features
    })).find(g => g.id === server_id);

    if (!guild) {
      return reply.code(404).send({ error: 'Bot not part of guild.' });
    }

    return guild;
  });

  // POST /@bot/servers/:server_id/action
  fastify.post('/servers/:server_id/action', { preHandler: fastify.authenticate }, async (request) => {
    const { server_id } = request.params;
    const { action } = request.body;
    return { server_id, action, status: 'executed', user: request.user };
  });
}