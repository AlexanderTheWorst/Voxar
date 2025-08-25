import mongoose, { model, Schema } from "mongoose";
import mongodb from "../index";

// Use env variable to set collection name
const collectionName = process.env.NODE_ENV === 'production'
  ? 'dev'
  : 'prod';

const SessionSchema = Schema({
    id: {
        type: String, 
        required: true
    },
    access_token: String,
    refresh_token: String
})

export default mongoose.models.Session || model("Session", SessionSchema, collectionName);