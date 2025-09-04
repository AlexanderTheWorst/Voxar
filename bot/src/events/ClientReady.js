import { REST, Routes } from "discord.js";
import { stat, readdirSync, statSync } from "fs";
import { resolve, basename } from "path";
import { pathToFileURL } from "url";

const { DISCORD_BOT_TOKEN: token = undefined, DISCORD_CLIENT_ID: clientId = undefined } = process.env;

const rest = new REST().setToken(token);

export const data = {
    once: true
}

function normalizeCommand(cmd) {
    return {
        name: cmd.name,
        description: cmd.description,
        type: cmd.type,
        options: cmd.options?.map(opt => normalizeCommand(opt)), // recursive for nested options
        default_member_permissions: cmd.default_member_permissions ?? null,
        dm_permission: cmd.dm_permission ?? true,
        nsfw: cmd.nsfw ?? false,
        // add any other fields your bot cares about
    };
}

function commandsAreEqual(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        const normalizedA = normalizeCommand(a[i]);
        const normalizedB = normalizeCommand(b[i]);

        if (JSON.stringify(normalizedA) !== JSON.stringify(normalizedB)) return false;
    }

    return true;
}

export async function execute(client) {
    console.log(`[Client] Bot online on ${client.user.username}`);

    let awaitCommands = [];

    let commandDirectoryPath = resolve(import.meta.dirname, "..", "commands");
    for (let file of readdirSync(commandDirectoryPath, { recursive: true })) {
        let absPath = resolve(commandDirectoryPath, file);
        let stats = statSync(absPath);

        if (stats.isDirectory()) { // Do something here, since it's a folder.

        } else { // This is a file.
            let fileUrl = pathToFileURL(absPath).href;
            let fileName = basename(file).replace(".js", "");
            let command = await import(fileUrl);
            awaitCommands.push(command);
        }
    }

    let commands = await Promise.all(awaitCommands);

    console.log(`[CommandHandler] ${commands.length} commands (${commands.flatMap(({ data }) => data.aliases).length} aliases) found.`)

    let loadedCommands = [];

    // Prepare new commands
    commands.forEach(c => {
        loadedCommands.push(...c.jsonify());
    });

    console.log("[CommandHandler] Verifying commands.");

    // Fetch current commands on the guild
    let currentData = await rest.get(
        Routes.applicationGuildCommands(clientId, "1404769420651401216")
    );

    if (commandsAreEqual(currentData, loadedCommands)) {
        console.log("[CommandHandler] No changes detected. Skipping update.");
    } else {
        console.log("[CommandHandler] Changes detected. Updating commands...");

        // Clear existing commands
        await rest.put(
            Routes.applicationGuildCommands(clientId, "1404769420651401216"),
            { body: [] }
        );

        // Update with new commands
        const updatedData = await rest.put(
            Routes.applicationGuildCommands(clientId, "1404769420651401216"),
            { body: loadedCommands }
        );

        console.log(`[CommandHandler] Updated ${updatedData.length} commands.`);
    }
}