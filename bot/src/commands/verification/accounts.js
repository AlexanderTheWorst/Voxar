/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("discord.js").Interaction} Interaction
 */

import { ApplicationCommandOptionType, MessageFlags, SlashCommandBuilder } from "discord.js"

export const data = {
    name: "accounts",
    description: "Get all your accounts",
    aliases: [],
    options: []
}

export const jsonify = () => {
    let commands = [];

    for (let commandName of [data.name, ...data.aliases]) {
        let command = new SlashCommandBuilder();
        command.setName(commandName);
        command.setDescription(data.description);

        for (let option of data?.options || []) {
            let typeName = Object.keys(ApplicationCommandOptionType).find(
                key => ApplicationCommandOptionType[key] === option.type
            );

            if (!typeName) continue;

            let func = command[`add${typeName}Option`];
            if (!func) continue;

            func.call(command, opt =>
                opt.setName(option.name.toLowerCase() || "option")
                    .setRequired(option.required || false)
                    .setDescription(option.description || "This is the description.")
            );
        }

        commands.push(command.toJSON());
    }

    return commands;
}

/**
 * 
 * @param {Interaction} interaction 
 * @param {Client} client 
 */
export const execute = (interaction, client) => {
    let { UserCache } = client.locals;
    let { id } = interaction.user;

    interaction.reply({
        content: UserCache.get(id)?.linkedAccounts.map(a => `${a.username}`).join(", ") || "No accounts!"
    });
}