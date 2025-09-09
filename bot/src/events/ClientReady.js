/**
 * @typedef {import("discord.js").Client} Client
 */

import { Collection, Events, Guild, REST, Routes } from "discord.js";
import { stat, readdirSync, statSync } from "fs";
import { resolve, basename } from "path";
import { pathToFileURL } from "url";
import { ModuleManager } from "@voxar/shared";
import { mongo } from "@voxar/mongodb";

// import shared from "../../index.js";

// import server from "../api/server.js";
import { GuildCache } from "../lib/db/GuildCache.js";
import { UserCache } from "../lib/db/UserCache.js";

const { DISCORD_BOT_TOKEN: token = undefined, DISCORD_CLIENT_ID: clientId = undefined } = process.env;

const rest = new REST().setToken(token);

export const data = {
    event: Events.ClientReady,
    once: true
}

function normalizeCommand(cmd) {
    return {
        name: cmd.name,
        description: cmd.description,
        type: cmd.type,
        options: (cmd.options || [])?.map(opt => normalizeCommand(opt)), // recursive for nested options
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

/**
 * 
 * @param {Client} client 
 */
async function loadCommands(client) {
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
    client.commands = commands;

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

/**
 * 
 * @param {Client} client 
 */
async function loadModules(client) {
    client.guilds.fetch(); // Fetch all guilds into cache.
    
    client.locals.modules = new Collection(); // Create the collection.
    
    console.log(`[ModuleManager] Loading modules for ${client.guilds.cache.size} guilds.`);

    client.guilds.cache.forEach(async guild => {
        let { id } = guild;

        try {
            client.locals?.modules.set(id, ModuleManager.all(guild));
        } catch(err) {
            console.log(`[ModuleManager] Failed to load modules for ${id}`);
        }
    });

    console.log(`[ModuleManager] Loaded modules for ${client.locals?.modules.size} guilds.`);
}

/**
 * 
 * @param {Client} client 
 */
async function loadGuildCache(client) {
    if (!mongo.connection.readyState == 1) console.log("[GuildCache] Mongoose is not connected.");

    let guildCache = new GuildCache();
    await guildCache.init();

    client.locals.GuildCache = guildCache;
}

/**
 * 
 * @param {Client} client 
 */
async function loadUserCache(client) {
    if (!mongo.connection.readyState == 1) console.log("[UserCache] Mongoose is not connected.");

    let userCache = new UserCache();
    await userCache.init();

    client.locals.UserCache = userCache;
}

/**
 * 
 * @param {Client} client 
 */
export async function execute(client) {
    console.log(`[Client] Bot online on ${client.user.username}`);

    client.locals = {
        // REST: server
    }; // Assign locals for easier access.

    await loadGuildCache(client);
    await loadUserCache(client);
    await loadModules(client);
    await loadCommands(client);
}