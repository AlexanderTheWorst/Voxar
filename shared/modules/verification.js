import { GuildModel as db } from "@voxar/mongodb/models/guild.js";

function buildDefaults(schema) {
    const result = {};
    for (const key in schema) {
        if (schema[key].type) {
            // Leaf node: use default value
            result[key] = schema[key].default ?? null;
        } else {
            // Nested object: recurse
            result[key] = buildDefaults(schema[key]);
        }
    }
    return result;
}

export default function VerificationModule(guild) {
    return {
        key: "verification",
        name: "Verification",
        description: "Control the verification process.",

        schema: {
            enabled: { type: Boolean, default: true },
            settings: {
                rename_users: {
                    enabled: { type: Boolean, default: false },
                    options: {
                        format: { type: String, default: "{USERNAME}" },
                    }
                },

                verified_role: {
                    enabled: { type: Boolean, default: false },
                    options: {
                        role: { type: String, default: null },
                    }
                },

                verification_channel: {
                    enabled: { type: Boolean, default: false },
                    options: {
                        channel: { type: String, default: null },
                    }
                }
            }
        },

        settings: [
            {
                key: "rename_users",
                name: "Rename users",
                description: "Change the user's discord name to their Roblox name.",
                options: [
                    {
                        key: "format",
                        name: "Format",
                        description: `
                        The format of which the new name inherits from.
                        <span class="w-fit rounded-[8px] p-[8px] bg-red-500/25">
                            <span class="font-medium">{GROUP_ROLE}</span>: The name of their role
                        </span>
                        <span class="w-fit rounded-[8px] p-[8px] bg-red-500/25">
                            <span class="font-medium">{USERNAME}</span>: The name of their account
                        </span>
                        `,
                        type: "text",
                    }
                ]
            },
            {
                key: "verified_role",
                name: "Give user role",
                description: "Role given to the user when verified.",
                options: [
                    {
                        key: "role",
                        name: "Role",
                        description: "The role to give.",
                        type: "role",
                    }
                ]
            },
            {
                key: "verification_channel",
                name: "Verification channel",
                description: "The only channel where /verify can be run.",
                options: [
                    {
                        key: "channel",
                        name: "Channel",
                        description: "The channel in which the command can be used.",
                        type: "channel"
                    }
                ]
            },
        ],

        // Enable / Disable module
        async setModuleState(value) {
            await db.updateOne(
                { guildId: guild },
                { $set: { [`modules.${this.key}.enabled`]: value } },
                { upsert: true }
            );
        },

        // Enable / Disable setting
        async setSettingState(key, value) {
            await db.updateOne(
                { guildId: guild },
                { $set: { [`modules.${this.key}.settings.${key}.enabled`]: value } },
                { upsert: true }
            );
        },

        // Changing setting options
        async updateSettingOption(setting, key, value) {
            await db.updateOne(
                { guildId: guild },
                { $set: { [`modules.${this.key}.settings.${setting}.options.${key}`]: value } },
                { upsert: true }
            );
        },

        async get() {
            // Build full nested defaults
            const defaults = buildDefaults(this.schema);

            // Try to find guild document
            let doc = await db.findOne({ guildId: guild });

            if (!doc) {
                doc = await db.create({
                    guildId: guild,
                    modules: {
                        [this.key]: defaults
                    }
                })

                const moduleData = doc.modules.get(this.key).toObject
                    ? doc.modules.get(this.key).toObject()
                    : doc.modules.get(this.key);

                // Remove _id
                const { _id, ...cleanModule } = moduleData;

                return cleanModule;
            }

            // Document exists: ensure modules Map exists
            if (!doc.modules) doc.modules = new Map();

            // Ensure this module exists
            if (!doc.modules.has(this.key)) {
                doc.modules.set(this.key, defaults);

                await db.updateOne(
                    { guildId: guild },
                    { $set: { [`modules.${this.key}`]: defaults } }
                );
            }

            // Get the module from the Map
            const moduleData = doc.modules.get(this.key).toObject
                ? doc.modules.get(this.key).toObject()
                : doc.modules.get(this.key);

            // Remove _id
            const { _id, ...cleanModule } = moduleData;
            return cleanModule;
        },

        async hydrate() {
            let data = await this.get();
            let { key, name, description, settings } = this;

            settings = Array.from(settings)
            Object.entries(data.settings).forEach(([key, settingData]) => {
                let found = settings.find(setting => setting.key == key);
                found.enabled = settingData.enabled;
                console.log(settingData.enabled);

                Object.entries(settingData.options).forEach(([optionKey, optionData]) => {
                    let foundOption = found.options.find(o => o.key == optionKey);
                    // console.log(optionKey, optionData);
                    foundOption.value = optionData;
                });
            });

            return {
                key,
                name,
                description,
                settings,
                enabled: data.enabled,
            }
        },

        resolvePath(path, root = this) {
            const keys = path.split(".");

            function recurse(obj, remainingKeys) {
                if (!obj || typeof obj !== "object") return undefined;
                if (remainingKeys.length === 0) return obj;

                const [nextKey, ...restKeys] = remainingKeys;

                // Try direct property first
                if (nextKey in obj) {
                    return recurse(obj[nextKey], restKeys);
                }

                // Only traverse "logical containers"
                const containers = ["settings", "options"];
                for (const container of containers) {
                    if (container in obj && Array.isArray(obj[container])) {
                        for (const item of obj[container]) {
                            if (item.key === nextKey) {
                                return recurse(item, restKeys);
                            }
                        }
                    } else if (container in obj && typeof obj[container] === "object") {
                        const found = recurse(obj[container], remainingKeys);
                        if (found !== undefined) return found;
                    }
                }

                return undefined; // not found
            }

            let data = recurse(root, keys);
            if (data) return data;
            
            for (let setting of this.settings) {
                let data = recurse(setting, keys);
                if (data) return data;
            }
        },

        // ✅ Handler for runtime behavior
        async handler(ctx) {
            // ctx = { guild, member, message }
            // Example: enforce verification channel
        },
    };
}