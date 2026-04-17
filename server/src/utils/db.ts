import mongoose from "mongoose";

export const connectDB = async () : Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI){
            throw new Error ("MONGODB_URI is not defined");
        }
        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on("error", (err) => {
            console.error(`MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected. Attempting to reconnect...");
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("MongoDB connection closed due to app termination");
            process.exit(0);
        });
    }
    catch (error){
        console.error(`MongoDB connection failed: ${(error as Error).message}`);
        process.exit(1);
    }
}