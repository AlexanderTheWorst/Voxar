import fp from 'fastify-plugin';

async function authPlugin(fastify) {
    fastify.decorate('authenticate', async (request, reply) => {
        const token = request.headers['authorization'];
        console.log(token);

        if (!token) {
            return reply.code(401).send({ error: 'Missing access_token' });
        }
    });
}

export default fp(authPlugin);