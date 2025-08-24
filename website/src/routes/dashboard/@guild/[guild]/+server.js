import * as SessionModel from "$lib/prisma/models/session.js";

export async function GET({ params, cookies }) {
    let { guild } = params;

    const sessionId = cookies.get("session");
    if (!sessionId) {
        return { user: null };
    }

    const session = await SessionModel.findById(sessionId);
    if (!session) {
        return { user: null };
    }

    const guildResponse = await fetch(`http://${process.env.DOCKER ? "bot:3000" : "localhost:3000"}/@bot/servers/${guild}`, {
        headers: new Headers({
            "Authorization": session.access_token
        })
    })

    if (!guildResponse.ok) return new Response(
        JSON.stringify({ error: guildResponse.text() }),
        {
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });

    return new Response(
        JSON.stringify(
            await guildResponse.json()
        ),
        {
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }
    )
}