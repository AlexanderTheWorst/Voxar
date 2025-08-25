export const data = {
    once: true
}

export async function execute(client) {
    console.log(client.user.username);
    console.log(await client.guilds.fetch());

    // const guild = await client.guilds.fetch("1167832454866944000");
    // guild.leave();
}