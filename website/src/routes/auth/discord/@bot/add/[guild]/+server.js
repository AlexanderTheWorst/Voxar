import { redirect } from '@sveltejs/kit';

const {
    DISCORD_OAUTH2_CLIENT_ID: client_id = undefined
} = process.env;

export async function GET({ params, url }) {
    const { guild } = params;
    const { origin } = url;

    const redirect_uri = `redirect_uri=${origin}/auth/discord/@bot/callback`; 

    // TODO: Fix a better way to handle this.
    throw redirect(
        307,
        `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=469773344&integration_type=0&scope=bot&guild_id=${guild}&disable_guild_select=true&${redirect_uri}&response_type=code`
    )
}