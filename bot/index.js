import { config } from "dotenv";
config({ path: "./.env", quiet: true, override: true });

import { init as botInit } from "./src/client.js";
import { init as serverInit } from "./src/api/server.js";

const server = await serverInit();
const client = await botInit();

console.log("TEST!")

import { connectDB } from "@voxar/mongodb";
await connectDB();

export default {
    client, 
    server,

    verificationSessions: [
        {
            userId: "874756379687141437",
            guildId: "911175480521154561",
            sessionId: "1"
        }
    ]
}