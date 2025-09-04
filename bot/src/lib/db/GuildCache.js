import { GuildModel } from "@voxar/mongodb/models/Guild.js";

export class GuildCache {
    constructor() {
        this.cache = new Map(); // guildId -> guildData
        this.events = {
            change: [],
            delete: []
        };
    }

    async init() {
        // Load all guilds once on startup
        const guilds = await GuildModel.find({});
        for (const guild of guilds) {
            this.cache.set(guild.guildId, this.sanitize(guild));
        }
        console.log(`[Cache] Loaded ${guilds.length} guilds`);

        // Watch for changes in MongoDB
        const stream = GuildModel.watch();
        stream.on("change", (change) => this.handleChange(change));
    }

    async handleChange(change) {
        if (!change.documentKey) return;

        const guildId = change.documentKey._id;

        switch (change.operationType) {
            case "insert":
            case "replace":
            case "update": {
                // Fetch fresh copy and update cache
                let updated = await GuildModel.findById(guildId);
                if (updated) {
                    updated = this.sanitize(updated);
                    this.cache.set(updated.guildId, updated);
                    console.log(`[Cache] Updated guild ${updated.guildId}`);
                    this.events.change.forEach(callback => callback(updated.guildId, updated));
                }
                break;
            }

            case "delete": {
                this.cache.delete(guildId);
                console.log(`[Cache] Removed guild ${guildId}`);
                this.events.change.forEach(callback => callback(guildId));
                break;
            }            
        }
    }

    sanitize(object) {
        try {
            object = Object.fromEntries(object);
        } catch(err) {}

        let { _id, __v, ...clean } = object.toObject ? object.toObject() : object;

        Object.entries(clean).forEach(([key, value]) => {
            try {
                if (typeof(value) == "object") {
                    clean[key] = this.sanitize(value);
                } else clean[key] = value
            } catch(err) {
                // console.log(err);
            }
        });
        // Object.keys(clean).forEach(key => {

        //     let value = clean[key];
            
        //     switch (typeof(value)) {
        //         case "object":
        //             console.log(key);
        //             let a = value;
        //             try {
        //                 a = Object.fromEntries(value);

        //                 Object.entries(a).forEach(([key, { _id, __v, ...data }]) => {
        //                     a[key] = data;
        //                     console.log(data);
        //                 })
        //             } catch(err) {
                        
        //             }
        //             clean[key] = a;
        //             break;
        //     }
        // })
        // console.log(clean, "SANITIZED!");
        return clean;
    }

    get(guildId) {
        return this.cache.get(guildId);
    }

    on(eventName, eventCallback) {
        if (eventName && this.events[eventName] && eventCallback) {
            this.events[eventName].push(eventCallback);

            return () => {
                let index = this.events[eventName].findIndex(c => c === eventCallback);
                this.events[eventName].slice(index, index);
            }
        }
    }

    async update(guildId, update) {
        // Write to DB
        const updated = await GuildModel.findOneAndUpdate(
            { guildId },
            update,
            { new: true, upsert: true }
        );

        // Update cache immediately
        if (updated) {
            this.cache.set(guildId, updated.toObject());
        }
        return updated;
    }
}