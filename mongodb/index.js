import mongoose from "mongoose";
import { config } from "dotenv"

config({ path: "../.env", quiet: true, override: false });

export async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DATABASE_URL, {
            useUnifiedTopology: true,
            dbName: process.env.NODE_ENV == "production" ? "prod" : "dev"
        });
    }
}

connectDB();