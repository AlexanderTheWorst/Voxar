import fp from 'fastify-plugin';
import { whoami } from '../../lib/discord-api.js';

async function authPlugin(fastify) {
    fastify.decorate('authenticate', async (request, reply) => {
        const token = request.headers['authorization'];
        console.log(token);
        request.locals = { ...(request.locals ?? {}) };

        if (!token) {
            return reply.code(401).send({ error: 'Missing access_token' });
        }

        const user = await whoami(token);

        if (!user) {
            return reply.code(401).send({ error: 'Invalid access_token' });
        }

        request.locals.user = user;
    });
}

export default fp(authPlugin);