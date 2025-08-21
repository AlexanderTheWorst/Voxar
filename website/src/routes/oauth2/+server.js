import { json, redirect } from '@sveltejs/kit';

const { 
    DISCORD_OAUTH2_CLIENT_ID: discord_client_id = undefined,
    DISCORD_OAUTH2_CLIENT_SECRET: discord_client_secret = undefined,
    DISCORD_OAUTH2_REDIRECT_URI: discord_redirect_uri = undefined,
    DISCORD_OAUTH2_REDIRECT_URI_DEV: discord_redirect_uri_dev = undefined,
} = process.env;

function extractQueries(searchParams) {
    let entries = searchParams.entries();
    let lookup = {};
    entries.forEach(a => lookup[a[0]] = a[1]);
    return lookup;
}

function getDiscordOAuth2Link(request) {
    const { hostname } = request.url;

    let redirect_uri = (["localhost", "127.0.0.1"]).includes(hostname) ? discord_redirect_uri_dev : discord_redirect_uri;

    console.log(redirect_uri);

    return (`
    https://discord.com/oauth2/authorize?client_id=${discord_client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=identify+guilds
    `).trim();
}

function discordOAuth2(request, code) {
    let oauth2Link = getDiscordOAuth2Link(request);

    if (!code) return redirect(307, oauth2Link);

    return new Response(
        new URLSearchParams({
            code
        }),
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
        case "discord": return discordOAuth2(request, code, query);
        case "roblox": return robloxOAuth2(request, code, query)
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