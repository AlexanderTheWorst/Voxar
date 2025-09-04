import Fastify from 'fastify';
import authPlugin from './plugins/auth.js';
import botRoutes from './routes/@bot/servers.js';

const fastify = Fastify({ logger: false });

fastify.register(authPlugin);
fastify.register(botRoutes, { prefix: '/@bot' });

fastify.listen({ port: 3000, host: '0.0.0.0' })
    .then(() => console.log('[RestApi] Listening to port 3000'))
    .catch(err => {
        fastify.log.error(err);
        process.exit(1);
    });

export default {

}