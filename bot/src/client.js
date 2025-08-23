import { BitField, Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { readdirSync, readFileSync } from "fs";
import { resolve, dirname, relative, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // If you need message content
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const eventsFolder = resolve(__dirname, "events");
const events = {};

for (const file of readdirSync(eventsFolder, { recursive: true })) {
    if (file.endsWith('.js')) {
        const absPath = resolve(eventsFolder, file);
        const fileUrl = pathToFileURL(absPath).href;
        events[file.toLowerCase().replace('.js', '')] = await import(fileUrl);
    }
}

for (let event in Events) {
    let eventHandler = events[event.toLowerCase()];
    if (eventHandler) {
        let { data, execute } = eventHandler;
        if (!execute) throw new Error(`${event} is missing a proper 'execute' function.`)
        if (data?.once ?? false) {
            client.once(Events[event], (...args) => execute(...args));
        } else {
            client.on(Events[event], (...args) => execute(...args));
        }
    }
}

client.login(process.env.DISCORD_BOT_TOKEN);