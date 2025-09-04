import { readdirSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

let path = resolve(import.meta.dirname, "modules");
let files = readdirSync(path);

let modules = [];
let keys = {};

for (let file of files) {
    let fileUrl = pathToFileURL(resolve(path, file)).href;

    let module = await import(fileUrl);
    modules.push(module.default);
}

export const ModuleManager = {
    all: (guild) => {
        return modules.map(m => m(guild))
    },
    get: (module, guild) => {
        console.log(modules);
        let m = modules.find(m => m.key == module);
        if (m) return m(guild);
        else return null;
    }
};