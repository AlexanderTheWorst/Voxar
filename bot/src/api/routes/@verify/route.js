import shared from "@voxar/bot";

export default async function routes(fastify) {
    console.log("[RestApi@verify] Route loaded!");

    // GET /@verify
    fastify.get('/', async (request, reply) => {
        return {
            dev: "Hello, world!"
        };
    });

    // GET /@verify/[sessionId]
    fastify.get('/:sessionId', async (request, reply) => {
        let { verificationSessions } = shared;
        let { sessionId: requestedSessionId = undefined } = request.params;

        let session = verificationSessions.find(({ userId, guildId, sessionId }) => sessionId === requestedSessionId);

        if (session) return reply.status(200).send(session);
        else return reply.status(404).send("Invalid session!");
    });

    // POST /@verify/[sessionId]
    fastify.post('/:sessionId/complete', { preHandler: fastify.authenticate }, async (request, reply) => {
        const { user } = request.locals;
        console.log(user);

        return {
            Hello: "world!"
        }
    });
}