const {
    ROBLOX_CLIENT_SECRET: client_secret = undefined,
    ROBLOX_CLIENT_ID: client_id = undefined
} = process.env;

const baseUrl = "https://apis.roblox.com/oauth";

export function getOAuth2Link({ url }, state) {
    const { hostname, port } = url;

    const redirect_uri = `${(["localhost", "127.0.0.1"]).includes(hostname) ? "http://" : "https://"}${hostname}${port ? `:${port}` : ""}/auth/roblox/callback`;

    const searchParams = new URLSearchParams({
        client_id,
        redirect_uri,
        scope: "openid profile group:read",
        response_type: "code",
        state
    });

    return `${baseUrl}/v1/authorize?${searchParams.toString()}`;
}

export async function tokenExchange(code) {
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

export async function whoami(token) {
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