import { redirect } from "@sveltejs/kit";
import * as UserModel from "@voxar/mongodb/models/user";
import { whoami, tokenExchange } from "$lib/roblox-api.js";

export async function load({ url, locals }) {
    const { searchParams } = url;
    const { user } = locals;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");

    if (error || error_description) return { error, error_description };

    const token = await tokenExchange(code);

    if (!token) return { error: "request_error", error_description: "Token exchange failed." }

    const robloxUser = await whoami(token.access_token);

    if (!robloxUser) return { error: "token_error", error_description: "Request failed when trying to access user information." }

    await UserModel.linkRobloxUser(user.user.id, {
        id: robloxUser.sub,
        username: robloxUser.preferred_username,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        valid_until: new Date(Date.now() + token.expires_in * 1000)
    });

    return {
        id: robloxUser.sub,
        user: robloxUser
    }
}