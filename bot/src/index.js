import { config } from "dotenv";
config({ path: "../.env", quiet: true, override: true });

const { client } = await import("./client.js");
const server = await import("./api/server.js");