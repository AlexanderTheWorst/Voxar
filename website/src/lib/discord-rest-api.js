const base = 'https://discord.com/api/v10';

const { 
    DISCORD_OAUTH2_CLIENT_ID: client_id = undefined,
    DISCORD_OAUTH2_CLIENT_SECRET: client_secret = undefined,
} = process.env;

/* 
 | tokenExchange(code*, redirect_uri*)    ->    Exchanges the user's code into an access_token.
 | *code                                  ->    The user's code returned from OAuth2 authorization.
 | *redirect_uri                          ->    A redirect_uri that exists in your discord application.
*/
export async function tokenExchange(code, redirect_uri) {
    try {
        return await fetch(`${base}/oauth2/token`, {
            method: "POST",
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri
            }),
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(client_id+":"+client_secret)}`
            })
        }).then(res => res.json());
    } catch (err) {
        console.warn(err);
    }

    return console.warn("There was an error with the token exchange.");
}

/* 
 | tokenRefresh(refresh_token*)    ->    Refreshes the token and gives you a new access_token and refresh_token.
 | *refresh_token                  ->    The authenticated user's refresh_token.
*/
export async function tokenRefresh(refresh_token) {
    try {
        return await fetch(`${base}/oauth2/token`, {
            method: "POST",
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token
            }),
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(client_id+":"+client_secret)}`
            })
        }).then(res => res.json());
    } catch (err) {
        console.warn(err);
    }

    return console.warn("There was an error with the token exchange.");
}

/* 
 | whoami(access_token*)    ->    Tells you about the authenticated user.
 | *access_token            ->    The authenticated user's access_token.
*/
export async function whoami(access_token) {
    try {
        return await fetch(`${base}/oauth2/@me`, {
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            })
        }).then(res => res.json());
    } catch (err) {
        console.warn(err);
    }

    return console.warn("There was an error with the token exchange.");
}