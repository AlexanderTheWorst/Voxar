import mongoose from "mongoose";
import { config } from "dotenv"

config({ path: "../.env", quiet: true, override: false });

export async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        return await mongoose.connect(process.env.DATABASE_URL, {
            dbName: process.env.NODE_ENV == "production" ? "prod" : "dev"
        })
        // console.log("[MongoDB] Connected!")
    }
}

export const mongo = mongoose;