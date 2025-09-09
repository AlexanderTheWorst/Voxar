// src/hooks.server.js
import { error, redirect } from '@sveltejs/kit';
import { whoami } from '$lib/discord-api';
import * as SessionModel from "@voxar/mongodb/models/session";
import * as UserModel from "@voxar/mongodb/models/user";
import path from 'path';

const sessionLockedRoutes = ['/dashboard', '/auth/roblox'];

// Preload all +page.server.js files under routes
// const routeModules = import.meta.glob('/src/routes/**/+page.server.js');
// const relativeModules = {};

// Object.entries(routeModules).forEach(async ([path, mod]) => {
// 	relativeModules[path.split("src/routes")[1].split("+page.server.js")[0]] = (await mod());
// })

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const { cookies, locals, url, route } = event;
	const { id } = route;

	// Always try to hydrate user/session if cookie exists
	const session = cookies.get('session');
	if (session) {
		const authorizedUser = await SessionModel.findById(session);
		if (authorizedUser) {
			const user = await whoami(authorizedUser.access_token);
			if (user) {
				locals.user = user;
				locals.session = session;

				let userData = await UserModel.findById(user.user.id);
				if (!userData) userData = await UserModel.create({ id: user.user.id });
				let safeUserData = userData;
				locals.user_data = {
					id: safeUserData.id,
					linkedAccounts: safeUserData.linkedAccounts.map(g => ({
						id: g.id,
						username: g.username
					}))
				};
			} else {
				// token invalid; clear session
				await SessionModel.remove(authorizedUser.access_token);
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