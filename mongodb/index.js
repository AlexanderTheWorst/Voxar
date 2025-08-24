import mongoose from "mongoose";
import { config } from "dotenv"
import SessionModel from "./models/sessions";

config({ path: "../.env", quiet: true, override: false });

export async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DATABASE_URL, {
            useUnifiedTopology: true
        });
    }
}

connectDB();