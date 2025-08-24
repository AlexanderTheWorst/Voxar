import mongoose, { model, Schema } from "mongoose";
import mongodb from "../index";

const SessionSchema = Schema({
    id: {
        type: String, 
        required: true
    },
    access_token: String,
    refresh_token: String
})

export default mongoose.models.Session || model("Session", SessionSchema);