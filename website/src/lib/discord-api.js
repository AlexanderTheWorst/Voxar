import { getCache, setCache } from "./cache";

const base = 'https://discord.com/api/v10';

const {
    DISCORD_OAUTH2_CLIENT_ID: client_id = undefined,
    DISCORD_OAUTH2_CLIENT_SECRET: client_secret = undefined,
    DISCORD_OAUTH2_REDIRECT_URI: redirect_uri = undefined,
    DISCORD_OAUTH2_REDIRECT_URI_DEV: redirect_uri_dev = undefined,
} = process.env;

export const DiscordPermissions = {
    CREATE_INSTANT_INVITE: 1n << 0n,
    KICK_MEMBERS: 1n << 1n,
    BAN_MEMBERS: 1n << 2n,
    ADMINISTRATOR: 1n << 3n,
    MANAGE_CHANNELS: 1n << 4n,
    MANAGE_GUILD: 1n << 5n,
    ADD_REACTIONS: 1n << 6n,
    VIEW_AUDIT_LOG: 1n << 7n,
    PRIORITY_SPEAKER: 1n << 8n,
    STREAM: 1n << 9n,
    VIEW_CHANNEL: 1n << 10n,
    SEND_MESSAGES: 1n << 11n,
    SEND_TTS_MESSAGES: 1n << 12n,
    MANAGE_MESSAGES: 1n << 13n,
    EMBED_LINKS: 1n << 14n,
    ATTACH_FILES: 1n << 15n,
    READ_MESSAGE_HISTORY: 1n << 16n,
    MENTION_EVERYONE: 1n << 17n,
    USE_EXTERNAL_EMOJIS: 1n << 18n,
    VIEW_GUILD_INSIGHTS: 1n << 19n,
    CONNECT: 1n << 20n,
    SPEAK: 1n << 21n,
    MUTE_MEMBERS: 1n << 22n,
    DEAFEN_MEMBERS: 1n << 23n,
    MOVE_MEMBERS: 1n << 24n,
    USE_VAD: 1n << 25n,
    CHANGE_NICKNAME: 1n << 26n,
    MANAGE_NICKNAMES: 1n << 27n,
    MANAGE_ROLES: 1n << 28n,
    MANAGE_WEBHOOKS: 1n << 29n,
    MANAGE_GUILD_EXPRESSIONS: 1n << 30n,
    USE_APPLICATION_COMMANDS: 1n << 31n,
    REQUEST_TO_SPEAK: 1n << 32n,
    MANAGE_EVENTS: 1n << 33n,
    MANAGE_THREADS: 1n << 34n,
    CREATE_PUBLIC_THREADS: 1n << 35n,
    CREATE_PRIVATE_THREADS: 1n << 36n,
    USE_EXTERNAL_STICKERS: 1n << 37n,
    SEND_MESSAGES_IN_THREADS: 1n << 38n,
    USE_EMBEDDED_ACTIVITIES: 1n << 39n,
    MODERATE_MEMBERS: 1n << 40n,
    VIEW_CREATOR_MONETIZATION_ANALYTICS: 1n << 41n,
    USE_SOUNDBOARD: 1n << 42n,
    CREATE_GUILD_EXPRESSIONS: 1n << 43n,
    CREATE_EVENTS: 1n << 44n,
    USE_EXTERNAL_SOUNDS: 1n << 45n,
    SEND_VOICE_MESSAGES: 1n << 46n,
    SEND_POLLS: 1n << 49n,
    USE_EXTERNAL_APPS: 1n << 50n,
};

export function getRedirectUri(request) {
    const { hostname, origin, port, protocol } = request.url;
    // return (["localhost", "127.0.0.1"]).includes(hostname) ? redirect_uri_dev : redirect_uri;
    return `${["localhost", "127.0.0.1"].includes(hostname) ? "http" : "https"}://${hostname}:${port}/auth/discord/callback`;
}

export function getOAuth2Link(request) {
    let redirect_uri = getRedirectUri(request);

    return (`
        https://discord.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=identify+guilds
    `).trim();
}

export function hasPermission(permissions, permission) {
    return (BigInt(permissions) & permission) == permission
}

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

export async function whoami(access_token) {
    const cached = getCache(`user_${access_token}`);
    if (cached) return cached;

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

        let json = await res.json();
        setCache(`user_${access_token}`, json, 60_000);
        return json;
    } catch (err) {
        console.warn(err.message);
        return null;
    }
}

export async function getGuilds(access_token) {
    const cached = getCache(`guilds_${access_token}`);
    if (cached) return cached;

    try {
        const res = await fetch(`${base}/users/@me/guilds`, {
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            })
        });

        if (!res.ok) {
            console.log(res.text());
            return null;
        }

        let json = await res.json();
        setCache(`guilds_${access_token}`, json, 30_000);
        return json;
    } catch (err) {
        console.warn(err.message);
        return null;
    }
}