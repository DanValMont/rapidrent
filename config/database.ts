import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
    mongoose.set("strictQuery", true);
    // If the database is already connected, don't connect again
    if (connected) {
    console.log("MongoDb is already connected...");
    return;
    }
    // Connect to MongoDB
    try {
        if(process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            connected = true;
            console.log("MongoDb connected...");
        } else {
            console.error("MONGODB_URI is not defined in environment variables");
        }
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;