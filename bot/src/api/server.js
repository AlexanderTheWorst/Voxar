import Fastify from 'fastify';
import authPlugin from './plugins/auth.js';
import botRoutes from './routes/@bot/route.js';
import verifyRoutes from './routes/@verify/route.js';
import fastifyPlugin from 'fastify-plugin';
import shared from "@voxar/bot";
import { v4 } from 'uuid';

const fastify = Fastify({ logger: false });

export async function init() {
    fastify.register(authPlugin);
    
    fastify.addContentTypeParser("application/json", {}, (req, payload, done) => {
        req.rawBody = payload.rawBody
        done(null, payload.body)
      })

    fastify.register(botRoutes, { prefix: '/@bot' });
    fastify.register(verifyRoutes, { prefix: '/@verify' });

    fastify.listen({ port: 3000, host: '0.0.0.0' })
        .then(() => console.log('[RestApi] Listening to port 3000'))
        .catch(err => {
            fastify.log.error(err);
            process.exit(1);
        });

    return {
        startVerificationSession: ({ userId, guildId }) => {
            if (shared.verificationSessions.find(({ userId: _userId = undefined }) => _userId == userId)) return null;
            
            let sessionData = {
                userId, 
                guildId, 
                sessionId: v4()
            };

            shared.verificationSessions.push(sessionData);

            return sessionData;
        }
    }
}