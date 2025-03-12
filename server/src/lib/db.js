import mongoose from "mongoose";
const DB_URL = process.env.DB_URL;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log("Connect to DB: ", conn.connection.host);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
};
