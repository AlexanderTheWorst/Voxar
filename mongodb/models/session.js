import mongoose, { model, Schema } from "mongoose";
// import mongodb from "../index";

const SessionSchema = Schema({
    id: {
        type: String,
        required: true
    },
    discord_user: String,
    access_token: String,
    refresh_token: String,
    valid_until: Date
})

const SessionModel = mongoose.models.Session || model("Session", SessionSchema);

export async function create(data) {
    return await SessionModel.create(data);
}

export async function findById(id) {
    return await SessionModel.findOne({ id }).exec();
}

export async function remove(id) {
    return await SessionModel.deleteOne({ id }).exec();
}