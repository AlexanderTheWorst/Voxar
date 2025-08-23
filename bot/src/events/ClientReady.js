export const data = {
    once: true
}

export async function execute(client) {
    console.log(client.user.username);
    console.log(await client.guilds.fetch())
}