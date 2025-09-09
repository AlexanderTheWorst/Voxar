import { UserModel } from "@voxar/mongodb/models/User.js";

export class UserCache {
    constructor() {
        this.cache = new Map(); // guildId -> guildData
        this.events = {
            change: [],
            delete: []
        };
    }

    async init() {
        // Load all guilds once on startup
        const users = await UserModel.find({}).lean();
        for (const user of users) {
            let sanitized = this.sanitize(user);
            sanitized.linkedAccounts = sanitized.linkedAccounts.map(a => ({ // Strip out access- refresh-tokens.
                id: a.id,
                username: a.username
            }));
            this.cache.set(user.id, sanitized);
        }
        console.log(`[UserCache] Loaded ${users.length} users`);

        // Watch for changes in MongoDB
        const stream = UserModel.watch();
        stream.on("change", (change) => this.handleChange(change));
    }

    async handleChange(change) {
        if (!change.documentKey) return;

        const userId = change.documentKey._id;

        switch (change.operationType) {
            case "insert":
            case "replace":
            case "update": {
                // Fetch fresh copy and update cache
                let updated = await UserModel.findById(userId).lean();
                if (updated) {
                    updated = this.sanitize(updated);
                    this.cache.set(updated.id, updated);
                    console.log(`[UserCache] Updated user ${updated.id}`);
                    this.events.change.forEach(callback => callback(updated.id, updated));
                }
                break;
            }

            case "delete": {
                this.cache.delete(userId);
                console.log(`[UserCache] Removed user ${userId}`);
                this.events.change.forEach(callback => callback(userId));
                break;
            }            
        }
    }

    sanitize(object, seen = new WeakSet()) {
        if (object && typeof object === "object") {
            if (seen.has(object)) {
                return; // Prevent infinite loop on circular references
            }
            seen.add(object);
        }
    
        // Handle Map -> plain object
        if (object instanceof Map) {
            const normalized = {};
            for (const [key, value] of object.entries()) {
                normalized[key] = this.sanitize(value, seen);
            }
            return normalized;
        }
    
        // Handle plain object
        if (object && typeof object === "object" && !Array.isArray(object)) {
            const normalized = {};
            for (const [key, value] of Object.entries(object)) {
                if (key === "_id" || key === "__v") continue; // strip mongoose internals
                normalized[key] = this.sanitize(value, seen);
            }
            return normalized;
        }
    
        // Handle arrays
        if (Array.isArray(object)) {
            return object.map(v => this.sanitize(v, seen));
        }
    
        // Primitives
        return object;
    }

    get(userID) {
        return this.cache.get(userID);
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

    async update(userId, update) {
        // Write to DB
        const updated = await UserModel.findOneAndUpdate(
            { userId },
            update,
            { new: true, upsert: true }
        );

        // Update cache immediately
        if (updated) {
            this.cache.set(userId, updated.toObject());
        }
        return updated;
    }
}