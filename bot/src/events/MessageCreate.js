/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("discord.js").Message} Message
 */

import { ModuleManager } from "@voxar/shared";
import { Events } from "discord.js";

export const data = {
    event: Events.MessageCreate,
    once: false
}

/**
 * @param {Message} message
 * @param {Client} client
 */
export async function execute(message, client) {
    let { GuildCache, modules } = client.locals;
    let { content, guildId } = message;

    let guildModules = modules.get(guildId);
    if (!guildModules) {
        modules.set(guildId, ModuleManager.all(guildId));
    }

    if (content.startsWith("!")) { // Prefix
        let sanitized = content.slice(1, content.length).split(" "); // Start at 1 since 0 is !
        let [command, ...args] = sanitized;

        if (command == "modules") {
            let cached = GuildCache.get(guildId);
            let string = "";

            Object.entries(cached.modules).forEach(([key, module]) => {
                let moduleData = guildModules.find(m => m.key == key);

                string += `- ${key} -> ${module.enabled}`;
                Object.entries(module.settings).forEach(([settingKey, settingData]) => {
                    string += `\n  -   ${settingKey} -> ${settingData.enabled}`;
                    Object.entries(settingData.options).forEach(([optionKey, optionData]) => {
                        let path = ([optionKey]).join(".");
                        let found = moduleData.resolvePath(path);

                        if (found) {
                            if (optionData) string += `\n    -   ${optionKey} -> ${found.type == "role" ? "<@&" : found.type == "channel" ? "<#" : ""}${optionData}${found.type == "role" || found.type == "channel" ? ">" : ""}`;
                            else string += `\n    -   ${optionKey} -> Unset`;
                        }
                    });
                });
            })
            let botReply = message.reply(
                string
            );
        }
    }
}