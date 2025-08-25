// src/hooks.server.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import { redirect } from '@sveltejs/kit';
import { findById, remove } from "$lib/server/models/session";
import { whoami } from '$lib/discord-api';

globalThis.__dirname = dirname(fileURLToPath(import.meta.url));
globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.require = createRequire(import.meta.url);

console.log("TEST!");

const sessionLockedRoutes = ['/dashboard'];

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const { cookies, locals, url } = event;

	// return new Response(new URLSearchParams({
	// 	protocol: url.protocol,
	// 	port: url.port,
	// 	hostname: url.hostname,
	// 	https: url.
	// }), {
	// 	headers: new Headers({
	// 		"Content-Type": "application/json"
	// 	})
	// });

	// Always try to hydrate user/session if cookie exists
	const session = cookies.get('session');
	if (session) {
		const authorizedUser = await findById(session);
		if (authorizedUser) {
			const user = await whoami(authorizedUser.access_token);
			if (user) {
				locals.user = user;
				locals.session = session;
			} else {
				// token invalid; clear session
				await remove(authorizedUser.access_token);
				cookies.delete('session', { path: '/' });
			}
		} else {
			cookies.delete('session', { path: '/' });
		}
	}

	// Redirect if route is protected and not logged in
	const needsAuth = sessionLockedRoutes.some((path) => url.pathname.startsWith(path));
	if (needsAuth && !locals.user) {
		throw redirect(307, '/auth/discord/login');
	}

	return resolve(event);
}