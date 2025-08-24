import { redirect } from '@sveltejs/kit';

export async function GET({ url }) {
    const { searchParams } = url;

    const guild_id = searchParams.get("guild_id");

    // Assume the redirect failed or returned with faulty data.
    // TODO: Fix the logic behind this.
    if (!guild_id) throw redirect(307, `/`); 

    throw redirect(307, `/dashboard/@guild/${guild_id}`);
}