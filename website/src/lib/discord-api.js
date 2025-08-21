const base = 'https://discord.com/api/v10';

const {
    DISCORD_OAUTH2_CLIENT_ID: client_id = undefined,
    DISCORD_OAUTH2_CLIENT_SECRET: client_secret = undefined,
    DISCORD_OAUTH2_REDIRECT_URI: redirect_uri = undefined,
    DISCORD_OAUTH2_REDIRECT_URI_DEV: redirect_uri_dev = undefined,
} = process.env;

/* 
 | getRedirectUri(request*)    ->    Returns the valid redirect uri based on enviroment.
 | *request                    ->    SvelteKit request
*/
export function getRedirectUri(request) {
    const { hostname } = request.url;
    return (["localhost", "127.0.0.1"]).includes(hostname) ? redirect_uri_dev : redirect_uri;
}

/* 
 | getOAuth2Link(request*)    ->    Returns the OAuth2 authorization link.
 | *request                   ->    SvelteKit request
*/
export function getOAuth2Link(request) {
    let redirect_uri = getRedirectUri(request);

    return (`
        https://discord.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=identify+guilds
    `).trim();
}

/* 
 | tokenExchange(code*, redirect_uri*)    ->    Exchanges the user's code into an access_token.
 | *code                                  ->    The user's code returned from OAuth2 authorization.
 | *redirect_uri                          ->    A redirect_uri that exists in your discord application.
*/
export async function tokenExchange(code, redirect_uri) {
    try {
        const res = await fetch(`${base}/oauth2/token`, {
            method: "POST",
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri
            }),
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(client_id + ":" + client_secret)}`
            })
        });

        if (!res.ok) {
            return null;
        }
    
        return await res.json();
    } catch (err) {
        console.warn(err);
        return null;
    }
}

/* 
 | tokenRefresh(refresh_token*)    ->    Refreshes the token and gives you a new access_token and refresh_token.
 | *refresh_token                  ->    The authenticated user's refresh_token.
*/
export async function tokenRefresh(refresh_token) {
    try {
        const res = await fetch(`${base}/oauth2/token`, {
            method: "POST",
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token
            }),
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(client_id + ":" + client_secret)}`
            })
        });

        if (!res.ok) {
            return null;
        }
    
        return await res.json();
    } catch (err) {
        console.warn(err);
        return null;
    }
}

/* 
 | whoami(access_token*)    ->    Tells you about the authenticated user.
 | *access_token            ->    The authenticated user's access_token.
*/
export async function whoami(access_token) {
    try {
        const res = await fetch(`${base}/oauth2/@me`, {
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            })
        });

        if (!res.ok) {
            return null;
        }
    
        return await res.json();
    } catch (err) {
        console.warn(err);
        return null;
    }
}

/* 
 | guilds(access_token*)    ->    Gives you a list of all the guilds the authenticated user is in.
 | *access_token            ->    The authenticated user's access_token.
*/
export async function getGuilds(access_token) {
    try {
        const res = await fetch(`${base}/users/@me/guilds`, {
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            })
        });

        if (!res.ok) {
            return null;
        }
    
        return await res.json();
    } catch (err) {
        console.warn(err);
        return null;
    }
}