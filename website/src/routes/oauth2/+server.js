import { json, redirect } from '@sveltejs/kit';

function getOAuth2Link(request) {
    console.log(request.url)
}

function extractQueries(searchParams) {
    let entries = searchParams.entries();
    let lookup = {};
    entries.forEach(a => lookup[a[0]] = a[1]);
    return lookup;
}

function discordOAuth2(request, code) {
    let oauth2URI = getOAuth2Link(request);

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