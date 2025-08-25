import { redirect } from '@sveltejs/kit';

const base_url = "https://apis.roblox.com/oauth";

const {
    ROBLOX_CLIENT_ID: client_id = undefined
} = process.env;

export async function GET({ locals, url }) {
    const { user } = locals;
    const { hostname, port } = url;

    const redirect_uri = `${(["localhost", "127.0.0.1"]).includes(hostname) ? "http://" : "https://"}${hostname}${port ? `:${port}` : ""}/auth/roblox/callback`;

    const searchParams = new URLSearchParams({
        client_id,
        redirect_uri,
        scope: "openid profile group:read",
        response_type: "code"
    });

    // TODO: Probably fix this mess.
    throw redirect(307, `${base_url}/v1/authorize?${searchParams.toString()}`)
}