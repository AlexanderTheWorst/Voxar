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

const express = require("express");
const app = express();

if (!isInDocker()) {
    require("dotenv").config({ path: "../.env", quiet: true, override: true })
}

app.get("/", (req, res) => {
    res.send(process.env.DOCKER, process.env.DOCKER_NAME);
})

app.listen(3000, () => {
    console.log("* localhost:3000");
});