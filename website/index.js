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

const client = new PrismaClient();

(async () => {
    console.log("HELLO!");

    let user = await client.user.create({
        data: {}
    });

    console.log(user);
})();

setInterval(() => {}, 1e6); // keeps Node alive without blocking the event loop