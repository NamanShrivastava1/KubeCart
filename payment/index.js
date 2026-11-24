import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
import { config } from "./src/config/config.js";
import logger from "./src/utils/logger.js";

const startServer = async () => {
  try {
    await connectToDb();

    app.listen(config.PORT, () => {
      logger.info(
        {
          port: config.PORT,
          environment: config.NODE_ENV,
        },
        "Payment Service started",
      );
    });
  } catch (error) {
    logger.fatal({ err: error }, "Failed to start Payment Service");
    process.exit(1);
  }
};

startServer();
