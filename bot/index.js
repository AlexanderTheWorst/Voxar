const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

function isInDocker() {
    try {
        const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8");
        return cgroup.includes("docker") || cgroup.includes("kubepods");
    } catch {
        return false;
    }
}

if (!isInDocker()) {
    require("dotenv").config({ path: "../.env", quiet: true, override: true })
}

let client = new PrismaClient();

setTimeout(async () => {
    console.log(await client.user.findMany())
}, 2000)

setInterval(() => {}, 1e6); // keeps Node alive without blocking the event loop