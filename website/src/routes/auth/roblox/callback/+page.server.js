import { redirect } from "@sveltejs/kit";
import * as UserModel from "@voxar/mongodb/models/user";

const {
    ROBLOX_CLIENT_SECRET: client_secret = undefined,
    ROBLOX_CLIENT_ID: client_id = undefined
} = process.env;

const baseUrl = "https://apis.roblox.com/oauth";

async function tokenExchange(code) {
    /*
        curl --location --request POST 'https://apis.roblox.com/oauth/v1/token' \
            --header 'Content-Type: application/x-www-form-urlencoded' \
            --data-urlencode 'client_id=840974200211308101' \
            --data-urlencode 'client_secret=RBX-CR9...St12L' \
            --data-urlencode 'grant_type=authorization_code' \
            --data-urlencode 'code=yCnq4ofX1...XmGpdx'
    */

    const res = await fetch(`${baseUrl}/v1/token`, {
        method: "POST",
        body: new URLSearchParams({
            code,
            client_id,
            client_secret,
            grant_type: "authorization_code"
        }),
        headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
        })
    });

    if (!res.ok) {
        console.warn(await res.text());
        return;
    }

    return await res.json();
}

async function whoami(token) {
    /*
        curl --location --request GET 'https://apis.roblox.com/oauth/v1/userinfo' \
            --header 'Authorization: Bearer eyjlflabtfl...4gxqYBG'
    */

    const res = await fetch(`${baseUrl}/v1/userinfo`, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        })
    });

    if (!res.ok) {
        console.warn(await res.text());
        return;
    }

    return await res.json();
}

export async function load({ url, locals }) {
    console.log(url);

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