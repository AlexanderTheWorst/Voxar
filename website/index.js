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
    console.log(process.env.DOCKER, process.env.DOCKER_NAME, process.env.ROBLOX_OAUTH2_TEST)
    res.send(`${process.env.DOCKER ? "Docker!" : "Not a docker!"} ${process.env.DOCKER_NAME ? process.env.DOCKER_NAME : "No name for docker!"}`);
})

app.listen(3000, () => {
    console.log("* localhost:3000");
});