export default async function routes(fastify) {
    // GET /@bot/servers/:server_id
    fastify.get('/servers/:server_id', { preHandler: fastify.authenticate }, async (request) => {
        const { server_id } = request.params;
        return { server_id, status: 'ok', user: request.user };
    });

    // POST /@bot/servers/:server_id/action
    fastify.post('/servers/:server_id/action', { preHandler: fastify.authenticate }, async (request) => {
        const { server_id } = request.params;
        const { action } = request.body;
        return { server_id, action, status: 'executed', user: request.user };
    });
}  