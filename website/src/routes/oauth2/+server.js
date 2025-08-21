import { tokenExchange as discordTokenExchange, whoami as discordWhoAmI } from '$lib/discord-rest-api.js';
import { error, json, redirect } from '@sveltejs/kit';

const {
    DISCORD_OAUTH2_CLIENT_ID: discord_client_id = undefined,
    DISCORD_OAUTH2_CLIENT_SECRET: discord_client_secret = undefined,
    DISCORD_OAUTH2_REDIRECT_URI: discord_redirect_uri = undefined,
    DISCORD_OAUTH2_REDIRECT_URI_DEV: discord_redirect_uri_dev = undefined,
} = process.env;

function extractQueries(searchParams) {
    let entries = searchParams.entries();
    let lookup = {};
    entries.forEach(([key, value]) => lookup[key] = value);
    return lookup;
}

function getDiscordRedirectUri(request) {
    const { hostname } = request.url;
    return (["localhost", "127.0.0.1"]).includes(hostname) ? discord_redirect_uri_dev : discord_redirect_uri;
}

function getDiscordOAuth2Link(request) {
    let redirect_uri = getDiscordRedirectUri(request);

    return (`
        https://discord.com/oauth2/authorize?client_id=${discord_client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=identify+guilds
    `).trim();
}

async function discordOAuth2(request, code) {
    const query = extractQueries(request.url.searchParams);

    let redirect_uri = getDiscordRedirectUri(request);
    let oauth2Link = getDiscordOAuth2Link(request);

    if (!code) return redirect(307, oauth2Link);

    const token = await discordTokenExchange(code, redirect_uri);
    if (!token)
        return new Response(
            JSON.stringify({
                status: 404,
                body: {
                    message: "Invalid code passed by code query."
                }
            }),
            {
                status: 404,
                headers: new Headers({ "Content-Type": "application/json" })
            }
        );

    const whoami = await discordWhoAmI(token.access_token);

    console.log(token.message, whoami.message);

    return new Response(
        JSON.stringify(whoami),
        {
            status: 200,
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }
    )
}

function robloxOAuth2(request, code) {
    return redirect(307, "/");
}

export async function GET(request) {
    const { url } = request;
    const query = extractQueries(url.searchParams);
    const { platform, code } = query;
    console.log(query);

    switch (platform.toLowerCase()) {
        case null: return redirect("/");
        case "discord": return await discordOAuth2(request, code, query);
        case "roblox": return await robloxOAuth2(request, code, query)
    }

    return new Response(
        JSON.stringify({
            status: 404,
            body: {
                message: "Unhandled request to oauth2 route."
            }
        }),
        {
            status: 404,
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }
    )
}