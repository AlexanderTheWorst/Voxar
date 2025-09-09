/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("discord.js").Interaction} Interaction
 */

import { ModuleManager } from "@voxar/shared";
import { Events } from "discord.js";

export const data = {
    event: Events.InteractionCreate,
    once: false
}

/**
 * @param {Interaction} interaction
 * @param {Client} client
 */
export async function execute(interaction, client) {
    let { commands, locals } = client;
    let { GuildCache } = locals;

    let { guildId } = interaction;

    client.locals.modules = client.locals.modules || ModuleManager.all(guildId);

    if (interaction.isCommand()) {
        let command = commands.find(({ data }) => data.name == interaction.commandName);
        if (command) command.execute(interaction, client);
    }
}