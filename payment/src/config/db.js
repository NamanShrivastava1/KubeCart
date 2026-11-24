import mongoose from "mongoose";
import { config } from "../config/config.js";
import logger from "../utils/logger.js";

const connecToDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("Connected to database");
  } catch (error) {
    logger.fatal({ err: error }, "Failed to connect to database");
    process.exit(1);
  }
};

export default connecToDb;
