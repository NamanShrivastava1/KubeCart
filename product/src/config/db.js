import mongoose from "mongoose";
import { config } from "../config/config.js";

const connecToDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
};

export default connecToDb;
