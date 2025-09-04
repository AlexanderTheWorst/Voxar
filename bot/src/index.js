import { config } from "dotenv";
config({ path: "../.env", quiet: true, override: true });

const { client } = await import("./client.js");
const server = await import("./api/server.js");

import { connectDB, mongo } from "@voxar/mongodb";
import { GuildCache } from "./lib/db/GuildCache.js";
await connectDB().then(async () => {
    let cache = new GuildCache();
    await cache.init();

    client.locals.GuildCache = cache;

    cache.on("change", (guildId, guildData) => {
        console.log(guildId, guildData);
    })
});