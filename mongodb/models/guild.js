import mongoose, { model, Schema } from "mongoose";

const GuildSchema = new Schema({
    guildId: { type: String, required: true },
    modules: {
        type: Map,          // Use a Map to allow dynamic module names
        of: new Schema({}, { strict: false }), // Each module can have its own schema
        default: {}
    },
    users: [
        { 
            discordId: { type: String, required: true },
            robloxId: { type: String, required: true }
        }
    ]
});

export const GuildModel = mongoose.models.Guild || model("Guild", GuildSchema);