import { ApplicationCommandOptionType, SlashCommandBuilder } from "discord.js"

export const data = {
    name: "command",
    description: "Start the verifying process.",
    aliases: [],
    options: [
        {
            name: "test",
            required: true,
            type: ApplicationCommandOptionType.Role
        }
    ]
}

export const jsonify = () => {
    let commands = [];

    for (let commandName of [data.name, ...data.aliases]) {
        console.log(commandName);

        let command = new SlashCommandBuilder();
        command.setName(commandName);
        command.setDescription(data.description);

        for (let option of data.options) {
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

export const run = (interaction, client) => {

}