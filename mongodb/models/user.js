import mongoose, { model, Schema } from "mongoose";
// import mongodb from "../index";

const UserSchema = Schema({
    id: {
        type: String,
        required: true,
        unique: true // ensures one user per Discord ID
    },
    linkedAccounts: [
        {
            id: { type: String, required: true },
            username: { type: String, required: true },
            access_token: { type: String, required: true },
            refresh_token: { type: String, required: true },
            valid_until: Date
        }
    ]
}, { timestamps: true })

export const UserModel = mongoose.models.User || model("User", UserSchema);

export async function create(data) {
    const user = new UserModel(data);
    return await user.save();
}

export async function linkRobloxUser(id, roblox) {
    return await UserModel.findOneAndUpdate(
        { id, "linkedAccounts.id": roblox.id },
        {
            $set: {
                "linkedAccounts.$.username": roblox.username,
                "linkedAccounts.$.access_token": roblox.access_token,
                "linkedAccounts.$.refresh_token": roblox.refresh_token,
                "linkedAccounts.$.valid_until": roblox.valid_until
            }
        },
        { new: true }
    )
        || await UserModel.findOneAndUpdate(
            { id },
            { $push: { linkedAccounts: roblox } },
            { new: true }
        );
}

export async function removeRobloxUser(id, roblox) {
    return await UserModel.findOneAndUpdate(
        { id },
        { $pull: { linkedAccounts: { id: roblox.id } } },
        { new: true }
    );
}

export async function findById(id) {
    return await UserModel.findOne({ id: id }).exec();
}

export async function remove(id) {
    return await UserModel.deleteOne({ id: id }).exec();
}